-- Create courses table
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  image_url TEXT,
  duration TEXT,
  price NUMERIC,
  discounted_price NUMERIC,
  technologies TEXT[],
  curriculum JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  certification_info TEXT,
  mentor_support BOOLEAN DEFAULT true,
  category TEXT,
  status TEXT DEFAULT 'active',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  technologies TEXT[],
  metrics JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  category TEXT,
  status TEXT DEFAULT 'published',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mentors table
CREATE TABLE mentors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  experience TEXT,
  expertise TEXT[],
  technologies TEXT[],
  linkedin_url TEXT,
  bio TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  course TEXT,
  rating INTEGER DEFAULT 5,
  testimonial TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'published',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create enquiries table
CREATE TABLE enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  qualification TEXT,
  course TEXT,
  message TEXT,
  status TEXT DEFAULT 'New', -- New, Contacted, Follow-up, Converted, Closed
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  city TEXT,
  qualification TEXT,
  course_id UUID REFERENCES courses(id),
  course_name TEXT,
  batch TEXT,
  status TEXT DEFAULT 'New', -- New, Contacted, Enrolled, Active, Completed, Cancelled
  payment_status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setup Row Level Security (RLS) policies
-- Allow public read access to active data
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON courses FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can do everything on courses." ON courses FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public projects are viewable by everyone." ON projects FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can do everything on projects." ON projects FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public mentors are viewable by everyone." ON mentors FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can do everything on mentors." ON mentors FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public testimonials are viewable by everyone." ON testimonials FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can do everything on testimonials." ON testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Enquiries and Enrollments are private (except inserting)
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view and manage enquiries" ON enquiries FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert enrollments" ON enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view and manage enrollments" ON enrollments FOR ALL USING (auth.role() = 'authenticated');

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()   
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;   
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_modtime BEFORE UPDATE ON courses FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_mentors_modtime BEFORE UPDATE ON mentors FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_testimonials_modtime BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_enquiries_modtime BEFORE UPDATE ON enquiries FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_enrollments_modtime BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE courses, projects, mentors, testimonials, enquiries, enrollments;

-- Storage Configuration
insert into storage.buckets (id, name, public) values ('techogies-images', 'techogies-images', true) on conflict do nothing;

create policy "Public Access" on storage.objects for select using ( bucket_id = 'techogies-images' );
create policy "Auth Insert" on storage.objects for insert with check ( bucket_id = 'techogies-images' and auth.role() = 'authenticated' );
create policy "Auth Update" on storage.objects for update using ( bucket_id = 'techogies-images' and auth.role() = 'authenticated' );
create policy "Auth Delete" on storage.objects for delete using ( bucket_id = 'techogies-images' and auth.role() = 'authenticated' );

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
