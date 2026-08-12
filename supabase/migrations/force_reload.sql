-- We are going to isolate the most critical commands to ensure they don't fail due to existing configurations.

-- 1. Ensure PostgREST can actually access the table
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.proposals TO anon, authenticated;

-- 2. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
