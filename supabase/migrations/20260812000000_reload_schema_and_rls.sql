-- This migration ensures the proposals table exists with correct RLS and forces a schema cache reload.

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

-- Enable RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
DROP POLICY IF EXISTS "Allow public proposal submissions" ON public.proposals;
CREATE POLICY "Allow public proposal submissions" 
ON public.proposals
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated users to read
DROP POLICY IF EXISTS "Allow admin read access to proposals" ON public.proposals;
CREATE POLICY "Allow admin read access to proposals" 
ON public.proposals
FOR SELECT 
TO authenticated
USING (true);

-- Enable realtime
alter publication supabase_realtime add table public.proposals;

-- **CRITICAL**: Ensure PostgREST can actually access the table
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.proposals TO anon, authenticated;

-- **CRITICAL**: Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
