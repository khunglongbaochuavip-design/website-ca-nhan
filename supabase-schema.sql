-- Run this in your Supabase SQL Editor

-- Software table
CREATE TABLE IF NOT EXISTS software (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  content text DEFAULT '',
  version text DEFAULT '1.0.0',
  features text[] DEFAULT '{}',
  image_url text DEFAULT '',
  file_url text DEFAULT '',
  file_name text DEFAULT '',
  file_size bigint DEFAULT 0,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text DEFAULT '',
  cover_image text DEFAULT '',
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (allow public read, no auth write)
ALTER TABLE software ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read software
CREATE POLICY "Allow public read software" ON software FOR SELECT USING (true);
-- Allow anyone to update download_count
CREATE POLICY "Allow update download_count" ON software FOR UPDATE USING (true) WITH CHECK (true);
-- Allow service role to do everything (for API routes)
CREATE POLICY "Allow all for service role" ON software FOR ALL USING (true);

-- Allow anyone to read published blog posts
CREATE POLICY "Allow public read blog" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Allow all blog service" ON blog_posts FOR ALL USING (true);
