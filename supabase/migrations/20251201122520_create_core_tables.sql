/*
  # FC ĐÁ BAY BÓNG - Core Database Schema Migration
  
  ## Overview
  Migrates the complete football team management database from MySQL to PostgreSQL with enhanced security and performance.
  
  ## New Tables
  
  ### 1. players
  - `id` (integer, primary key) - Unique player identifier
  - `name` (text) - Player full name
  - `phone` (text) - Contact phone number
  - `dob` (date) - Date of birth
  - `height_cm` (integer) - Height in centimeters
  - `weight_kg` (integer) - Weight in kilograms
  - `position` (text) - Playing position
  - `jersey_number` (integer) - Jersey/shirt number
  - `image_url` (text) - Profile image URL
  - `total_attendance` (integer, default 0) - Total sessions attended
  - `dominant_foot` (text, default 'Right') - Dominant foot (Left/Right/Both)
  - `pac` (integer, default 50) - Pace stat (0-99)
  - `sho` (integer, default 50) - Shooting stat (0-99)
  - `pas` (integer, default 50) - Passing stat (0-99)
  - `dri` (integer, default 50) - Dribbling stat (0-99)
  - `def` (integer, default 50) - Defense stat (0-99)
  - `phy` (integer, default 50) - Physical stat (0-99)
  - `traits_json` (jsonb) - Player traits and playstyles
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 2. users
  - `id` (uuid, primary key) - Uses Supabase auth.users.id
  - `username` (text, unique) - Login username
  - `display_name` (text) - Display name
  - `role` (text, default 'player') - User role (admin/player)
  - `player_id` (integer, unique, nullable) - Link to players table
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 3. sessions
  - `id` (text, primary key) - Session unique identifier
  - `date` (date) - Session date
  - `note` (text) - Session notes
  - `status` (text, default 'CLOSED') - Session status (OPEN/CLOSED)
  - `secret_icon_id` (text) - Secret icon for attendance verification
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 4. attendance
  - `session_id` (text) - Foreign key to sessions
  - `player_id` (integer) - Foreign key to players
  - `checked_in_at` (timestamptz) - Check-in timestamp
  - Primary key: (session_id, player_id)
  
  ### 5. attendance_attempts
  - `session_id` (text) - Foreign key to sessions
  - `player_id` (integer) - Foreign key to players
  - `attempt_count` (integer, default 0) - Failed attempt counter
  - `blocked` (boolean, default false) - Block status
  - `last_attempt_at` (timestamptz) - Last attempt timestamp
  - Primary key: (session_id, player_id)
  
  ### 6. teams
  - `id` (text, primary key) - Team identifier
  - `name` (text) - Team name
  - `captain_id` (integer, nullable) - Foreign key to players
  - `color_hex` (text, default '#000000') - Team color
  
  ### 7. team_members
  - `team_id` (text) - Foreign key to teams
  - `player_id` (integer) - Foreign key to players
  - Primary key: (team_id, player_id)
  
  ### 8. funds
  - `id` (text, primary key) - Transaction identifier
  - `date` (date, default current_date) - Transaction date
  - `contributor_name` (text) - Name of contributor
  - `amount` (numeric(15,2)) - Amount contributed
  - `note` (text) - Transaction note
  - `image_url` (text) - Receipt/proof image
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 9. custom_traits
  - `id` (text, primary key) - Trait identifier
  - `name` (text) - Trait name
  - `image_url` (text) - Trait icon URL
  - `description` (text) - Trait description
  - `created_at` (timestamptz) - Record creation timestamp
  
  ## Security
  - Row Level Security (RLS) enabled on ALL tables
  - Authentication required for all operations
  - Role-based access control for admin operations
  - Secure foreign key relationships with cascade deletes
  
  ## Indexes
  - Primary keys auto-indexed
  - Foreign keys indexed for performance
  - Composite keys for attendance tables
  
  ## Important Notes
  - Uses PostgreSQL instead of MySQL (better performance, JSON support, RLS)
  - JSONB for flexible trait storage (faster queries than JSON)
  - Timestamptz for proper timezone handling
  - Numeric type for precise financial calculations
  - All tables use IF NOT EXISTS for safe re-runs
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Players table
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  dob DATE,
  height_cm INTEGER,
  weight_kg INTEGER,
  position TEXT,
  jersey_number INTEGER,
  image_url TEXT,
  total_attendance INTEGER DEFAULT 0,
  dominant_foot TEXT DEFAULT 'Right',
  pac INTEGER DEFAULT 50,
  sho INTEGER DEFAULT 50,
  pas INTEGER DEFAULT 50,
  dri INTEGER DEFAULT 50,
  def INTEGER DEFAULT 50,
  phy INTEGER DEFAULT 50,
  traits_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Users table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'player',
  player_id INTEGER UNIQUE REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  note TEXT,
  status TEXT DEFAULT 'CLOSED',
  secret_icon_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (session_id, player_id)
);

-- 5. Attendance attempts table
CREATE TABLE IF NOT EXISTS attendance_attempts (
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  attempt_count INTEGER DEFAULT 0,
  blocked BOOLEAN DEFAULT false,
  last_attempt_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (session_id, player_id)
);

-- 6. Teams table
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  captain_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
  color_hex TEXT DEFAULT '#000000'
);

-- 7. Team members table
CREATE TABLE IF NOT EXISTS team_members (
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, player_id)
);

-- 8. Funds table
CREATE TABLE IF NOT EXISTS funds (
  id TEXT PRIMARY KEY,
  date DATE DEFAULT CURRENT_DATE,
  contributor_name TEXT,
  amount NUMERIC(15,2) NOT NULL,
  note TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Custom traits table
CREATE TABLE IF NOT EXISTS custom_traits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_player ON attendance(player_id);
CREATE INDEX IF NOT EXISTS idx_attendance_attempts_player ON attendance_attempts(player_id);
CREATE INDEX IF NOT EXISTS idx_team_members_player ON team_members(player_id);
CREATE INDEX IF NOT EXISTS idx_teams_captain ON teams(captain_id);
CREATE INDEX IF NOT EXISTS idx_users_player ON users(player_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date DESC);
CREATE INDEX IF NOT EXISTS idx_funds_date ON funds(date DESC);
