-- Create students table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  city TEXT,
  qualification TEXT,
  latest_course TEXT,
  status TEXT DEFAULT 'Active', -- Active, Alumni, Dropped
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setup Row Level Security (RLS) policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view and manage students" ON students FOR ALL USING (auth.role() = 'authenticated');

-- Trigger to auto-update updated_at timestamp
CREATE TRIGGER update_students_modtime BEFORE UPDATE ON students FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Enable Realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE students;
