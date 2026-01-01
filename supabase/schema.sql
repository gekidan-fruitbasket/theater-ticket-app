-- =============================================
-- Theater Ticket Reservation App - Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. profiles (ユーザー情報)
-- =============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    line_user_id TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups by LINE user ID
CREATE INDEX idx_profiles_line_user_id ON profiles(line_user_id);

-- =============================================
-- 2. venues (劇場マスタ)
-- =============================================
-- layout_data structure:
-- {
--   "rows": [
--     {
--       "label": "A",
--       "seats": [
--         { "id": "A-1", "type": "seat" },
--         { "id": "A-2", "type": "seat" },
--         { "id": null, "type": "aisle" },
--         { "id": "A-3", "type": "seat" }
--       ]
--     }
--   ]
-- }
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    layout_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. performances (公演情報)
-- =============================================
CREATE TABLE performances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups by venue and start time
CREATE INDEX idx_performances_venue_id ON performances(venue_id);
CREATE INDEX idx_performances_start_time ON performances(start_time);

-- =============================================
-- 4. reservations (予約台帳)
-- =============================================
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    performance_id UUID NOT NULL REFERENCES performances(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    seat_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint: 同じ公演の同じ座席は1つだけ予約可能
    UNIQUE (performance_id, seat_id)
);

-- Index for faster lookups
CREATE INDEX idx_reservations_performance_id ON reservations(performance_id);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Venues: Everyone can read venues
CREATE POLICY "Venues are viewable by everyone" ON venues
    FOR SELECT USING (true);

-- Performances: Everyone can read performances
CREATE POLICY "Performances are viewable by everyone" ON performances
    FOR SELECT USING (true);

-- Reservations: Everyone can read, users can insert their own
CREATE POLICY "Reservations are viewable by everyone" ON reservations
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own reservations" ON reservations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
