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
  source TEXT DEFAULT 'migration', -- 'migration' veya 'user'
  user_id TEXT, -- Firebase UID (kullanıcı promptları için)
  approved BOOLEAN DEFAULT FALSE, -- Admin onayı
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE banana_prompts ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy: Allow Public Read Access (Only approved prompts)
CREATE POLICY "Public Prompts are viewable by everyone"
ON banana_prompts FOR SELECT
TO anon
USING (approved = true);

-- 4. Create Policy: Allow Authenticated Users to Insert
CREATE POLICY "Users can insert their own prompts"
ON banana_prompts FOR INSERT
TO anon
WITH CHECK (true);

-- 5. Create Policy: Allow Users to Update Their Own Prompts
CREATE POLICY "Users can update their own prompts"
ON banana_prompts FOR UPDATE
TO anon
USING (true);
