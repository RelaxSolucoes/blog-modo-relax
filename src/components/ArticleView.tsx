import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Clock, Share2, ThumbsUp, Loader2, Check } from 'lucide-react';
import { type Article, toggleArticleLike } from '../lib/supabase';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
}

export default function ArticleView({ article, onBack }: ArticleViewProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(article.user_has_liked || false);
  const [likesCount, setLikesCount] = useState(article.likes_count);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article]);

  // Função para calcular o tempo de leitura
  const calculateReadingTime = (content: string | null): number => {
    if (!content) return 0;
    
    // Remove HTML tags
    const textContent = content.replace(/<[^>]*>/g, '');
    
    // Conta palavras (considerando espaços e pontuação)
    const wordCount = textContent.trim().split(/\s+/).length;
    
    // Média de leitura: 200 palavras por minuto
    const readingTime = Math.ceil(wordCount / 200);
    
    // Retorna pelo menos 1 minuto
    return Math.max(1, readingTime);
  };

  const handleLike = async () => {
    try {
      setIsLiking(true);
      const liked = await toggleArticleLike(article.id);
      setHasLiked(liked);
      setLikesCount(prev => liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share && !window.location.href.includes('localhost')) {
        await navigator.share({
          title: article.title,
          text: article.excerpt || '',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to clipboard copy if sharing fails
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-[var(--relax-primary)] text-white font-medium shadow-sm transition-all duration-200 hover:bg-[var(--relax-primary-dark)] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar para artigos
      </button>

      {/* Article Header */}
      <div className="mb-8">
        <div className="text-blue-600 text-sm font-semibold mb-2">{article.category?.name}</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        
        {/* Article Meta */}
        <div className="flex flex-wrap items-center text-gray-600 gap-4">
          <div className="flex items-center">
            {article.author?.avatar_url ? (
              <img
                src={article.author.avatar_url}
                alt={article.author.name}
                className="w-6 h-6 rounded-full mr-2 object-cover"
              />
            ) : (
              <User className="w-4 h-4 mr-2" />
            )}
            <span>{article.author?.name}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date(article.published_at || '').toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{calculateReadingTime(article.content)} min de leitura</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="mb-8">
        <img
          src={article.featured_image || ''}
          alt={article.title}
          className="w-full h-[400px] object-cover rounded-lg"
        />
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-strong:font-bold prose-strong:text-gray-900 prose-em:text-gray-800 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:not-italic prose-li:text-gray-600">
        {article.content && (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        )}
      </article>

      {/* Article Actions */}
      <div className="border-t border-b py-6 my-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasLiked 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={handleLike}
            disabled={isLiking}
          >
            {isLiking ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ThumbsUp className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
            )}
            <span>{likesCount} Curtidas</span>
          </button>
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
              <span>Compartilhar</span>
            </button>
            {showCopiedMessage && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg flex items-center">
                <Check className="w-4 h-4 mr-1" />
                Link copiado!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}