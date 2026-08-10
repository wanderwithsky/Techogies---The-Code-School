-- Create callback_requests table
CREATE TABLE callback_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  qualification TEXT NOT NULL,
  interested_course TEXT NOT NULL,
  skill_level TEXT NOT NULL,
  career_goal TEXT NOT NULL,
  preferred_contact_time TEXT NOT NULL,
  status TEXT DEFAULT 'New', -- New, Contacted, In Progress, Completed, Cancelled
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setup Row Level Security (RLS) policies
ALTER TABLE callback_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert callback_requests" ON callback_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view and manage callback_requests" ON callback_requests FOR ALL USING (auth.role() = 'authenticated');

-- Trigger to auto-update updated_at timestamp
CREATE TRIGGER update_callback_requests_modtime BEFORE UPDATE ON callback_requests FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Enable Realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE callback_requests;
