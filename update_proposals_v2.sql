-- Run this script in your Supabase SQL Editor to create the `proposals` table.

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

-- Enable Row Level Security (RLS)
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public/anonymous users to insert a new proposal
CREATE POLICY "Allow public insert to proposals" 
ON public.proposals
FOR INSERT 
TO public
WITH CHECK (true);

-- Policy 2: Allow authenticated admins to view/read all proposals
CREATE POLICY "Allow admin read access to proposals" 
ON public.proposals
FOR SELECT 
TO authenticated
USING (true);

-- Enable realtime for this table if the dashboard relies on it
alter publication supabase_realtime add table public.proposals;
