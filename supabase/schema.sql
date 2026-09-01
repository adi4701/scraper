-- Users (Extended via Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'hobby',
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Processed Idea Clusters
CREATE TABLE IF NOT EXISTS idea_clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  urgency_score INTEGER CHECK (urgency_score >= 1 AND urgency_score <= 10),
  competitor_mentioned TEXT,
  summary_title TEXT NOT NULL,
  raw_complaint TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracked Keywords (Pro Users Only)
CREATE TABLE IF NOT EXISTS tracked_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by the owner" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Tracked keywords are viewable by owner" ON tracked_keywords
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
