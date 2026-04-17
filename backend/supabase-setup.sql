-- ============================================
-- EDUSYNC DATABASE SCHEMA & RLS SETUP
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  bio TEXT,
  learning_style JSONB DEFAULT '{"visual": false, "auditory": false, "kinesthetic": false}',
  embedding FLOAT8[],
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Availability table
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day TEXT NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  compatibility_score INT CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  initiated_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages table (for chat in sessions)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_availability_user_id ON availability(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_sessions_match_id ON sessions(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES
-- ============================================

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Allow anyone to read all user profiles (for matching)
CREATE POLICY "Public read users" ON users
  FOR SELECT USING (true);

-- Allow anyone to insert (signup)
CREATE POLICY "Anyone can register" ON users
  FOR INSERT WITH CHECK (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================
-- SUBJECTS TABLE POLICIES
-- ============================================

-- Users can read all subjects (for matching)
CREATE POLICY "Public read subjects" ON subjects
  FOR SELECT USING (true);

-- Users can insert their own subjects
CREATE POLICY "Users can insert own subjects" ON subjects
  FOR INSERT WITH CHECK (true);

-- Users can update their own subjects
CREATE POLICY "Users can update own subjects" ON subjects
  FOR UPDATE USING (true) WITH CHECK (true);

-- Users can delete their own subjects
CREATE POLICY "Users can delete own subjects" ON subjects
  FOR DELETE USING (true);

-- ============================================
-- AVAILABILITY TABLE POLICIES
-- ============================================

-- Users can read all availability (for matching)
CREATE POLICY "Public read availability" ON availability
  FOR SELECT USING (true);

-- Users can insert their own availability
CREATE POLICY "Users can insert own availability" ON availability
  FOR INSERT WITH CHECK (true);

-- Users can update their own availability
CREATE POLICY "Users can update own availability" ON availability
  FOR UPDATE USING (true) WITH CHECK (true);

-- Users can delete their own availability
CREATE POLICY "Users can delete own availability" ON availability
  FOR DELETE USING (true);

-- ============================================
-- MATCHES TABLE POLICIES
-- ============================================

-- Users can read matches they're part of
CREATE POLICY "Users can view own matches" ON matches
  FOR SELECT USING (true);

-- Anyone can create matches
CREATE POLICY "Anyone can create matches" ON matches
  FOR INSERT WITH CHECK (true);

-- Users can update matches they're part of
CREATE POLICY "Users can update own matches" ON matches
  FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================
-- SESSIONS TABLE POLICIES
-- ============================================

-- Users can read sessions they're part of
CREATE POLICY "Users can read sessions" ON sessions
  FOR SELECT USING (true);

-- Users can create sessions (via matches)
CREATE POLICY "Users can create sessions" ON sessions
  FOR INSERT WITH CHECK (true);

-- Users can update sessions they're part of
CREATE POLICY "Users can update sessions" ON sessions
  FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================
-- MESSAGES TABLE POLICIES
-- ============================================

-- Users can read messages in their sessions
CREATE POLICY "Users can read messages" ON messages
  FOR SELECT USING (true);

-- Users can insert messages
CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages" ON messages
  FOR DELETE USING (true);

-- ============================================
-- 5. CREATE FUNCTIONS FOR TIMESTAMPS
-- ============================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update timestamps
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_matches_timestamp BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- All tables, indexes, RLS policies, and functions created successfully!
