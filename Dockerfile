FROM node:20-slim

WORKDIR /app

# Copy and install frontend dependencies
COPY edusync-next/package*.json ./edusync-next/
RUN cd edusync-next && npm install

# Copy and install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy all source files
COPY . .

# Install Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy configuration and script
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Build Next.js frontend
RUN cd edusync-next && npm run build

# Expose the required port
EXPOSE 7860

# Run all services
CMD ["/app/start.sh"]