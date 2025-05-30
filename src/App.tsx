import React, { useState, useEffect } from 'react';
import { Search, Menu, BrainCog, Code2, Blocks, Cpu, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import ArticleView from './components/ArticleView';
import NewsletterForm from './components/NewsletterForm';
import { getArticles, type Article } from './lib/supabase';

function App() {
  const [showArticle, setShowArticle] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, debouncedSearchQuery]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const articles = await getArticles(selectedCategory, debouncedSearchQuery);
      setArticles(articles);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Finanças Descomplicadas', icon: <Code2 className="w-6 h-6" />, slug: 'financas-descomplicadas' },
    { name: 'Vida Saudável', icon: <BrainCog className="w-6 h-6" />, slug: 'vida-saudavel' },
    { name: 'Tech que Ajuda', icon: <Blocks className="w-6 h-6" />, slug: 'tech-que-ajuda' },
    { name: 'Estilo de Vida', icon: <Cpu className="w-6 h-6" />, slug: 'estilo-de-vida' },
  ];

  const footerLinks = {
    about: ['About Us', 'Careers', 'Contact Us', 'Press Kit'],
    resources: ['Blog', 'Newsletter', 'Events', 'Help Center'],
    legal: ['Terms', 'Privacy', 'Cookies', 'Licenses'],
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setShowArticle(true);
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(selectedCategory === slug ? undefined : slug);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Modo Relax</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-full shadow-sm transition-all duration-200 font-medium border border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2
                    ${selectedCategory === category.slug
                      ? 'bg-[var(--relax-primary-dark)] text-white shadow-md'
                      : 'bg-[var(--relax-bg-light)] text-[var(--relax-text)] hover:bg-[var(--relax-primary)] hover:text-white'}
                  `}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="md:hidden p-2 text-gray-600 hover:text-blue-600">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showArticle && selectedArticle ? (
        <ArticleView article={selectedArticle} onBack={() => setShowArticle(false)} />
      ) : (
        <>
          {/* Hero Section */}
          <div className="relative bg-relax-hero text-white overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
                alt="Relaxamento Natureza"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-teal-400 opacity-60"></div>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold mb-6">
                  Coloque sua Vida em Modo Relax
                </h1>
                <p className="text-xl mb-4">
                  Dicas práticas de finanças, saúde e tecnologia para viver com mais leveza, equilíbrio e liberdade.
                </p>
                <p className="mb-8">
                  Assine a newsletter e comece agora sua jornada rumo a uma vida mais tranquila.
                </p>
                <NewsletterForm />
              </div>
            </div>
          </div>

          {/* Articles Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">
                {selectedCategory
                  ? `${categories.find(c => c.slug === selectedCategory)?.name} Artigos`
                  : 'Todos os Artigos'}
              </h2>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className="px-5 py-2 rounded-full bg-[var(--relax-primary)] text-white font-medium shadow-sm transition-all duration-200 hover:bg-[var(--relax-primary-dark)] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
                >
                  Ver todos os artigos
                </button>
              )}
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : articles.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                    onClick={() => handleArticleClick(article)}
                  >
                    <img
                      src={article.featured_image || ''}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="text-blue-600 text-sm font-semibold mb-2">
                        {article.category?.name}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4">{article.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(article.published_at || '').toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-blue-600 font-semibold hover:text-blue-700">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No articles found. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand and Social */}
            <div className="col-span-2 md:col-span-1">
              <span className="text-2xl font-bold text-blue-600">Modo Relax</span>
              <p className="mt-4 text-gray-600">
                Inspirando você a relaxar e viver melhor.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                {footerLinks.about.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8">
            <p className="text-center text-gray-500">
              © {new Date().getFullYear()} Modo Relax. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;