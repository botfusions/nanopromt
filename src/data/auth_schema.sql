-- =============================================
-- BotsNANO User Authentication & Prompt Schema
-- =============================================

-- 1. BotsNANO Profiles Table
CREATE TABLE IF NOT EXISTS botsnano_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE botsnano_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON botsnano_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON botsnano_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON botsnano_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================

-- 2. BotsNANO User Prompts Table
CREATE TABLE IF NOT EXISTS botsnano_user_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES botsnano_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT,
  categories TEXT[] DEFAULT '{}',
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE botsnano_user_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved prompts are viewable by everyone" ON botsnano_user_prompts
  FOR SELECT USING (approved = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts" ON botsnano_user_prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts" ON botsnano_user_prompts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts" ON botsnano_user_prompts
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================

-- 3. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_botsnano_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.botsnano_profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_botsnano ON auth.users;
CREATE TRIGGER on_auth_user_created_botsnano
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_botsnano_user();
