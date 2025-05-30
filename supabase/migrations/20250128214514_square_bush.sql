/*
  # Add functions for incrementing and decrementing article likes

  1. Changes
    - Add function to increment article likes count
    - Add function to decrement article likes count
  
  2. Security
    - Functions are accessible to public
*/

-- Function to increment article likes
CREATE OR REPLACE FUNCTION increment_article_likes(article_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE articles 
  SET likes_count = likes_count + 1 
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement article likes
CREATE OR REPLACE FUNCTION decrement_article_likes(article_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE articles 
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to public
GRANT EXECUTE ON FUNCTION increment_article_likes(uuid) TO public;
GRANT EXECUTE ON FUNCTION decrement_article_likes(uuid) TO public;