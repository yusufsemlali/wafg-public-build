-- Create a function to directly create the profiles table
CREATE OR REPLACE FUNCTION create_profiles_table_direct()
RETURNS VOID AS $$
BEGIN
  -- Check if the profiles table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) THEN
    -- Create a minimal profiles table
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE
    );
    
    -- Set up Row Level Security
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    
    -- Create policies for profiles table
    CREATE POLICY "Public profiles are viewable by everyone"
      ON public.profiles
      FOR SELECT
      USING (true);
    
    CREATE POLICY "Users can update their own profile"
      ON public.profiles
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert their own profile"
      ON public.profiles
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END;
$$ LANGUAGE plpgsql;
