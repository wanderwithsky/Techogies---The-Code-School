import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with your actual credentials for migration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function migrateCourses() {
  console.log("Migrating courses...");
  const coursesPath = path.join(__dirname, '../src/data/courses.json');
  if (fs.existsSync(coursesPath)) {
    const data = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
    for (const item of data.courses || data) {
      const courseRecord = {
        title: item.title || item.name,
        slug: item.slug || item.title?.toLowerCase().replace(/\s+/g, '-'),
        short_description: item.shortDescription || item.description,
        full_description: item.fullDescription || item.description,
        image_url: item.image,
        duration: item.duration,
        price: item.price,
        discounted_price: item.discountedPrice,
        technologies: item.technologies || [],
        curriculum: item.curriculum || [],
        features: item.features || [],
        category: item.category,
        status: item.active !== false ? 'active' : 'inactive',
      };
      
      const { error } = await supabase.from('courses').insert(courseRecord);
      if (error) console.error(`Error inserting course ${courseRecord.title}:`, error.message);
      else console.log(`Inserted course: ${courseRecord.title}`);
    }
  }
}

async function migrateProjects() {
  console.log("Migrating projects...");
  const projectsPath = path.join(__dirname, '../src/data/projects.json');
  if (fs.existsSync(projectsPath)) {
    const data = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    for (const item of data.projects || data) {
      const record = {
        title: item.title,
        slug: item.slug || item.title?.toLowerCase().replace(/\s+/g, '-'),
        description: item.description,
        image_url: item.image,
        technologies: item.technologies || item.techStack || [],
        metrics: item.metrics || [],
        features: item.features || [],
        category: item.category,
      };
      const { error } = await supabase.from('projects').insert(record);
      if (error) console.error(`Error inserting project ${record.title}:`, error.message);
      else console.log(`Inserted project: ${record.title}`);
    }
  }
}

async function migrateMentors() {
  console.log("Migrating mentors...");
  const mentorsPath = path.join(__dirname, '../src/data/mentors.json');
  if (fs.existsSync(mentorsPath)) {
    const data = JSON.parse(fs.readFileSync(mentorsPath, 'utf8'));
    for (const item of data.mentors || data) {
      const record = {
        name: item.name,
        role: item.role || item.spec,
        experience: item.experience || item.exp,
        expertise: item.expertise || [],
        technologies: item.technologies || [],
        linkedin_url: item.linkedin,
        bio: item.bio,
        image_url: item.image || item.photo,
      };
      const { error } = await supabase.from('mentors').insert(record);
      if (error) console.error(`Error inserting mentor ${record.name}:`, error.message);
      else console.log(`Inserted mentor: ${record.name}`);
    }
  }
}

async function migrateTestimonials() {
  console.log("Migrating testimonials...");
  const path_ = path.join(__dirname, '../src/data/testimonials.json');
  if (fs.existsSync(path_)) {
    const data = JSON.parse(fs.readFileSync(path_, 'utf8'));
    for (const item of data.testimonials || data) {
      const record = {
        student_name: item.name,
        course: item.course,
        rating: item.rating || 5,
        testimonial: item.text || item.testimonial || item.review,
        image_url: item.image || item.photo,
      };
      const { error } = await supabase.from('testimonials').insert(record);
      if (error) console.error(`Error inserting testimonial ${record.student_name}:`, error.message);
      else console.log(`Inserted testimonial: ${record.student_name}`);
    }
  }
}

async function runAll() {
  console.log("Starting migration...");
  await migrateCourses();
  await migrateProjects();
  await migrateMentors();
  await migrateTestimonials();
  console.log("Migration complete!");
}

runAll();
