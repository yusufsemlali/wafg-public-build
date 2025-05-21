-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member' NOT NULL,
  member_since TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, avatar_url, member_since)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create RPC function to create profiles table (for use in setup script)
CREATE OR REPLACE FUNCTION create_profiles_table()
RETURNS VOID AS $$
BEGIN
  -- This function is just a wrapper for the SQL above
  -- It's used by the setup script to create the table
  -- The actual SQL is already executed when this migration runs
  NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to search profiles
CREATE OR REPLACE FUNCTION search_profiles(search_query TEXT)
RETURNS SETOF profiles AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM profiles
  WHERE 
    username ILIKE '%' || search_query || '%'
    OR user_id IN (
      SELECT id FROM auth.users 
      WHERE email ILIKE '%' || search_query || '%'
    )
  ORDER BY 
    CASE WHEN username ILIKE search_query || '%' THEN 0
         WHEN username ILIKE '%' || search_query || '%' THEN 1
         ELSE 2
    END,
    member_since DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
