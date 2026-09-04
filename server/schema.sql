CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'traveller')),
  photo_url TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT,
  province TEXT,
  category TEXT,
  description TEXT,
  short_description TEXT,
  image TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  entry_type TEXT,
  rating NUMERIC,
  opening_hours TEXT,
  recommended_duration TEXT,
  best_time_to_visit TEXT
);

CREATE TABLE IF NOT EXISTS place_nearby (
  place_id TEXT REFERENCES places(id) ON DELETE CASCADE,
  nearby_id TEXT REFERENCES places(id) ON DELETE CASCADE,
  PRIMARY KEY (place_id, nearby_id)
);

CREATE TABLE IF NOT EXISTS accommodations (
  id TEXT PRIMARY KEY,
  place_id TEXT REFERENCES places(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  distance TEXT,
  rating NUMERIC,
  price_category TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  place_id TEXT REFERENCES places(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER,
  comment TEXT,
  photo_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS feedback_responses (
  feedback_id TEXT PRIMARY KEY REFERENCES feedback(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  admin_name TEXT,
  responded_at TIMESTAMPTZ DEFAULT NOW()
);
