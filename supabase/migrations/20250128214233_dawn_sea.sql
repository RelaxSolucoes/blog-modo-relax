/*
  # Add likes to articles table

  1. Changes
    - Add `likes_count` column to `articles` table
    - Create `article_likes` table to track user likes
  
  2. Security
    - Enable RLS on `article_likes` table
    - Add policies for authenticated users to like/unlike articles
*/

-- Add likes count to articles
ALTER TABLE articles ADD COLUMN likes_count integer DEFAULT 0;

-- Create article_likes table
CREATE TABLE article_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, user_id)
);

ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to like/unlike articles
CREATE POLICY "Users can like articles"
  ON article_likes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update article likes count
CREATE OR REPLACE FUNCTION update_article_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE articles SET likes_count = likes_count + 1 WHERE id = NEW.article_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE articles SET likes_count = likes_count - 1 WHERE id = OLD.article_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating likes count
CREATE TRIGGER article_likes_count_trigger
  AFTER INSERT OR DELETE ON article_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_article_likes_count();