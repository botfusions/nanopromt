-- 1. Create the banana_prompts table
CREATE TABLE IF NOT EXISTS banana_prompts (
  id TEXT PRIMARY KEY,
  title TEXT,
  prompt TEXT,
  summary TEXT,
  categories TEXT[],
  author TEXT,
  date TEXT,
  images TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  prompt_cn TEXT,
  model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE banana_prompts ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy: Allow Public Read Access (Everyone can view prompts)
CREATE POLICY "Public Prompts are viewable by everyone"
ON banana_prompts FOR SELECT
TO anon
USING (true);

-- 4. Create Policy: Allow Anonymous Insert (TEMPORARY: Needed for migration script)
-- IMPORTANT: You should DISABLE/DELETE this policy after the migration is complete!
CREATE POLICY "Allow Anon Insert for Migration"
ON banana_prompts FOR INSERT
TO anon
WITH CHECK (true);

-- 5. Create Policy: Allow Anonymous Update (Optional, if you need to update rows)
CREATE POLICY "Allow Anon Update for Migration"
ON banana_prompts FOR UPDATE
TO anon
USING (true);
