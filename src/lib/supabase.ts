import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Author = {
  id: string;
  user_id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  author_id: string;
  category_id: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  likes_count: number;
  user_has_liked?: boolean;
  // Join fields
  category?: Category;
  author?: Author;
};

export type SubscriptionStatus = 'success' | 'error' | 'loading' | null;

// Local storage key for liked articles
const LIKED_ARTICLES_KEY = 'techinsights_liked_articles';

// Helper function to get liked articles from localStorage
function getLikedArticles(): string[] {
  const liked = localStorage.getItem(LIKED_ARTICLES_KEY);
  return liked ? JSON.parse(liked) : [];
}

// Helper function to save liked articles to localStorage
function saveLikedArticles(articles: string[]) {
  localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(articles));
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as Category[];
}

export async function getArticles(categorySlug?: string, searchQuery?: string) {
  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories!inner(*),
      author:authors(*)
    `)
    .eq('published', true);

  if (categorySlug) {
    query = query.eq('category.slug', categorySlug);
  }

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query.order('published_at', { ascending: false });
  
  if (error) throw error;

  // Add user_has_liked flag based on localStorage
  const likedArticles = getLikedArticles();
  return (data as Article[]).map(article => ({
    ...article,
    user_has_liked: likedArticles.includes(article.id)
  }));
}

export async function getArticleBySlug(slug: string) {
  const { data: article, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      author:authors(*)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single();
  
  if (error) throw error;

  // Check if the article is liked in localStorage
  const likedArticles = getLikedArticles();
  article.user_has_liked = likedArticles.includes(article.id);

  return article as Article;
}

export async function subscribeToNewsletter(email: string) {
  const { error } = await supabase
    .from('subscribers')
    .insert([{ email }]);
  
  if (error) {
    if (error.code === '23505') { // Unique violation
      throw new Error('This email is already subscribed to our newsletter.');
    }
    throw error;
  }
  
  return true;
}

export async function toggleArticleLike(articleId: string): Promise<boolean> {
  const likedArticles = getLikedArticles();
  const isLiked = likedArticles.includes(articleId);

  if (isLiked) {
    // Unlike the article
    const newLikedArticles = likedArticles.filter(id => id !== articleId);
    saveLikedArticles(newLikedArticles);
    
    // Update likes count in database
    await supabase.rpc('decrement_article_likes', { article_id: articleId });
    
    return false;
  } else {
    // Like the article
    likedArticles.push(articleId);
    saveLikedArticles(likedArticles);
    
    // Update likes count in database
    await supabase.rpc('increment_article_likes', { article_id: articleId });
    
    return true;
  }
}