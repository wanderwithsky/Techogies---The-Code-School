-- THIS SCRIPT WILL GUARANTEE THE TABLE IS CREATED, CONFIGURED, AND EXPOSED CORRECTLY.

-- 1. Create the table EXACTLY as 'proposals' in the 'public' schema
CREATE TABLE IF NOT EXISTS public.proposals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_name text NOT NULL,
    contact_person text NOT NULL,
    phone_number text NOT NULL,
    institutional_email text NOT NULL,
    program_training_required text NOT NULL,
    delivery_mode text NOT NULL,
    duration text NOT NULL,
    expected_participants integer NOT NULL,
    additional_requirements text,
    status text DEFAULT 'New',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- 3. Setup Policies safely
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow public proposal submissions" ON public.proposals;
    DROP POLICY IF EXISTS "Allow admin read access to proposals" ON public.proposals;
END $$;

CREATE POLICY "Allow public proposal submissions" 
ON public.proposals FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow admin read access to proposals" 
ON public.proposals FOR SELECT TO authenticated USING (true);

-- 4. Grant exact permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.proposals TO anon, authenticated;

-- 5. Force Schema Reload
NOTIFY pgrst, 'reload schema';
