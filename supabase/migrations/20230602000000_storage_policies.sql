-- Storage bucket policies for avatars
-- These policies should be applied in the Supabase dashboard
-- or through the Supabase CLI

-- Allow public read access to avatars
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (
    -- Allow upload to public folder
    (storage.foldername(name))[1] = 'public' OR
    -- Allow upload to user's own folder
    (storage.foldername(name))[1] = 'profiles' AND
    (storage.foldername(name))[2] = auth.uid()::text
  )
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (
    -- Allow update in public folder
    (storage.foldername(name))[1] = 'public' OR
    -- Allow update in user's own folder
    (storage.foldername(name))[1] = 'profiles' AND
    (storage.foldername(name))[2] = auth.uid()::text
  )
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (
    -- Allow delete in public folder
    (storage.foldername(name))[1] = 'public' OR
    -- Allow delete in user's own folder
    (storage.foldername(name))[1] = 'profiles' AND
    (storage.foldername(name))[2] = auth.uid()::text
  )
);
