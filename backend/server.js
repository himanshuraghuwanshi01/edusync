import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "node:http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import matchRoutes from "./routes/matches.js";
import sessionRoutes from "./routes/sessions.js";
import setupSocketHandlers from "./socket/index.js";
import { getOllamaStatus } from "./utils/ollamaClient.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://your-frontend.vercel.app"]
      : ["http://localhost:3000"],
  credentials: true,
};

// Security middleware
app.use(helmet());
app.use(morgan("combined"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit login attempts
  skipSuccessfulRequests: true,
  message: "Too many login attempts, please try again later.",
});

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Apply rate limiting to all API routes
app.use("/api/", limiter);

// Stricter rate limiting for auth routes
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/sessions", sessionRoutes);

// Health checks
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    ollama: getOllamaStatus(),
    uptime: process.uptime(),
  });
});

app.get("/test", (req, res) => {
  res.json({
    message: "Backend connected successfully ✅",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: "Route not found" 
  });
});

// Error handler (must be last)
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error("❌ Error:", error);
  
  // Rate limit error
  if (error.status === 429) {
    return res.status(429).json({
      success: false,
      error: error.message || "Too many requests",
    });
  }
  
  res.status(error.status || 500).json({
    success: false,
    error: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// Socket.io setup
const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
  maxHttpBufferSize: 10 * 1024 * 1024, // 10MB
});
setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, "localhost", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🤖 Ollama: ${getOllamaStatus().baseUrl || "not configured"}`);
  console.log(`📦 Database: Supabase (${process.env.SUPABASE_URL ? "✅" : "❌"})`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔒 Security: Rate limiting & Helmet enabled`);
});
