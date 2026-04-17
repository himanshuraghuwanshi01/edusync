# Backend Setup - Quick Start Guide

## ✅ Fixed Issues

### Ollama Module Import Error
**Issue:** `Cannot find module 'ollama/ollama.mjs'`

**Fix Applied:**
- Changed import from incorrect path to correct: `import { Ollama } from 'ollama'`
- Added fallback responses when Ollama is not running
- Made Ollama optional (can skip with SKIP_OLLAMA=true)
- Backend now works with or without Ollama

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
# Copy example file
cp .env.example .env

# Edit .env with your values
```

### 3. Configure .env
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
SKIP_OLLAMA=false           # Set to true if no Ollama
NODE_ENV=development
PORT=5000
```

### 4. Run Backend
```bash
# Development with auto-reload
npm run dev

# Or production
npm start
```

### 5. Verify Backend Running
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-17T10:30:00Z",
  "ollama": {
    "available": true,
    "baseUrl": "http://localhost:11434",
    "model": "llama3.2",
    "skipOllama": false
  }
}
```

---

## 🤖 Ollama Integration (Optional)

### With Ollama Running:
1. Download Ollama: https://ollama.ai
2. Install and start: `ollama serve`
3. Pull models:
   ```bash
   ollama pull llama3.2
   ollama pull nomic-embed-text
   ```
4. Backend will auto-detect and use Ollama

### Without Ollama:
Option A - Skip Ollama in .env:
```
SKIP_OLLAMA=true
```

Option B - Don't start Ollama service:
- Backend will use fallback AI responses
- Chat still works, just with simpler responses

---

## ✅ Backend Features Ready

### Working Endpoints:
- ✅ POST /api/auth/register
- ✅ POST /api/auth/login
- ✅ POST /api/auth/logout
- ✅ GET /api/users/:id
- ✅ GET /api/matches/recommendations
- ✅ POST /api/matches
- ✅ POST /api/sessions
- ✅ Socket.io real-time chat

### Features:
- ✅ User authentication
- ✅ Study partner matching
- ✅ Real-time messaging
- ✅ AI tutor (with fallback)
- ✅ Error handling
- ✅ Logging with emojis

---

## 🧪 Test Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

### Test Endpoint
```bash
curl http://localhost:5000/test
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "bio": "I love learning",
    "subjects": [{"name": "Math", "proficiency": "Advanced"}],
    "availability": [{"day": "Monday", "startTime": "14:00", "endTime": "16:00"}],
    "learningStyle": {"visual": true, "auditory": false, "kinesthetic": false}
  }'
```

---

## 🐛 Troubleshooting

### "Cannot find module 'ollama'"
**Solution:** Run `npm install` to ensure all dependencies are installed

### "ECONNREFUSED" (Ollama error)
**Solution:** Either:
- Start Ollama: `ollama serve`
- Or skip Ollama: set `SKIP_OLLAMA=true` in .env
- Backend will work with fallback responses

### "Cannot find module 'supabase'"
**Solution:** Run `npm install` again

### "ENOENT: no such file or directory '.env'"
**Solution:**
```bash
cp .env.example .env
# Then edit .env with your values
```

### "Cannot create table" errors
**Solution:** Ensure Supabase database is set up with proper tables

---

## ✅ Full Backend Status

| Component | Status | Notes |
|-----------|--------|-------|
| Auth routes | ✅ Working | Login, Register, Logout |
| User routes | ✅ Working | Profile management |
| Match routes | ✅ Working | Recommendations |
| Session routes | ✅ Working | Chat sessions |
| Socket.io | ✅ Ready | Real-time features |
| Ollama | ✅ Optional | Fallback available |
| Error handling | ✅ Complete | All endpoints |
| Logging | ✅ Working | Emoji format |

---

## 🚀 Ready to Launch!

```bash
# 1. Install
npm install

# 2. Setup .env
cp .env.example .env
# Edit .env

# 3. Run
npm run dev

# 4. Verify
curl http://localhost:5000/health

# ✅ Backend is running!
```

---

**Status:** ✅ READY
**Ollama:** Optional (with fallback)
**Frontend:** Connect to `http://localhost:5000`

Let me know if you need any help! 🚀
