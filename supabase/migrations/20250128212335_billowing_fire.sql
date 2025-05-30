/*
  # Blog Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Category name (e.g., Development, AI)
      - `slug` (text, unique) - URL-friendly version of name
      - `created_at` (timestamp)

    - `authors`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References auth.users
      - `name` (text) - Author's display name
      - `bio` (text) - Author's biography
      - `avatar_url` (text) - URL to author's avatar
      - `created_at` (timestamp)

    - `articles`
      - `id` (uuid, primary key)
      - `title` (text) - Article title
      - `slug` (text, unique) - URL-friendly version of title
      - `excerpt` (text) - Short description
      - `content` (text) - Full article content
      - `featured_image` (text) - URL to featured image
      - `author_id` (uuid) - References authors.id
      - `category_id` (uuid) - References categories.id
      - `published` (boolean) - Whether article is published
      - `published_at` (timestamp) - When article was published
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Policies for public read access to published content
    - Policies for author write access to their own content
*/

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT
  TO public
  USING (true);

-- Create authors table
CREATE TABLE authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Allow public read access to author profiles
CREATE POLICY "Author profiles are viewable by everyone" ON authors
  FOR SELECT
  TO public
  USING (true);

-- Allow authors to update their own profile
CREATE POLICY "Authors can update own profile" ON authors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create articles table
CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  featured_image text,
  author_id uuid REFERENCES authors(id) NOT NULL,
  category_id uuid REFERENCES categories(id) NOT NULL,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published articles
CREATE POLICY "Published articles are viewable by everyone" ON articles
  FOR SELECT
  TO public
  USING (published = true);

-- Allow authors to CRUD their own articles
CREATE POLICY "Authors can manage own articles" ON articles
  FOR ALL
  TO authenticated
  USING (author_id IN (
    SELECT id FROM authors WHERE user_id = auth.uid()
  ))
  WITH CHECK (author_id IN (
    SELECT id FROM authors WHERE user_id = auth.uid()
  ));

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on article updates
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial categories
INSERT INTO categories (name, slug) VALUES
  ('Development', 'development'),
  ('AI', 'ai'),
  ('No-Code', 'no-code'),
  ('Low-Code', 'low-code');