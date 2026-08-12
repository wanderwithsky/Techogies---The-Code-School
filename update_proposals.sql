-- Create proposals table
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  institutional_email TEXT NOT NULL,
  phone TEXT NOT NULL,
  program_required TEXT NOT NULL,
  delivery_mode TEXT NOT NULL,
  preferred_duration TEXT NOT NULL,
  expected_participants TEXT NOT NULL,
  additional_requirements TEXT,
  status TEXT DEFAULT 'New', -- New, Contacted, In Discussion, Proposal Sent, Converted, Closed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setup Row Level Security (RLS) policies
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert proposals" ON proposals FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view and manage proposals" ON proposals FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger to auto-update updated_at timestamp
CREATE TRIGGER update_proposals_modtime BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Enable Realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE proposals;
