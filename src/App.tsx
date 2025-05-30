import { useState, useEffect, useRef } from 'react';
import { Search, Menu, BrainCog, Code2, Blocks, Cpu } from 'lucide-react';
import ArticleView from './components/ArticleView';
import NewsletterForm from './components/NewsletterForm';
import { getArticles, type Article } from './lib/supabase';
import footerBg from './footer-bg.png';

function App() {
  const [showArticle, setShowArticle] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const articlesSectionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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


  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setShowArticle(true);
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(selectedCategory === slug ? undefined : slug);
    setTimeout(() => {
      articlesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Função para fechar menu mobile ao buscar
  const handleMobileSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setMobileMenuOpen(false);
      setTimeout(() => {
        articlesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Modo Relax</span>
            </div>
            {/* Desktop categorias */}
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
            {/* Desktop search */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
                {searchQuery && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                    tabIndex={-1}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button className="p-2 text-gray-600 hover:text-blue-600" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
            <div className="bg-white w-4/5 max-w-xs h-full p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-blue-600">Modo Relax</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-blue-600 text-2xl">×</button>
              </div>
              <div className="mb-6">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar artigos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    onKeyDown={handleMobileSearchKeyDown}
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                      tabIndex={-1}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => { handleCategoryClick(category.slug); setMobileMenuOpen(false); }}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-full shadow-sm transition-all duration-200 font-medium border border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2
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
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}
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
          <div ref={articlesSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                          {new Date(article.published_at || '').toLocaleString('pt-BR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'America/Sao_Paulo'
                          })}
                        </span>
                        <span className="text-blue-600 font-semibold hover:text-blue-700">
                          Ler mais →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Nenhum artigo encontrado. Tente ajustar sua busca ou filtros.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Pré-footer com imagem de fundo */}
      <div
        className="relative overflow-hidden min-h-[320px] flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${footerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay translúcido mais forte */}
        <div className="absolute inset-0 bg-white opacity-70 pointer-events-none" style={{zIndex:1}}></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full py-16">
          <span className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-lg" style={{textShadow: '2px 2px 10px #fff, 2px 2px 10px #000a'}}>Modo Relax</span>
          <p className="mt-4 text-lg md:text-2xl text-gray-800 text-center font-medium drop-shadow-lg" style={{textShadow: '2px 2px 10px #fff, 2px 2px 10px #000a'}}>Inspirando você a relaxar e viver melhor.</p>
          {/* Se desejar, adicione aqui os ícones de redes sociais realmente utilizados */}
        </div>
      </div>

      {/* Rodapé final com fundo sólido */}
      <footer className="bg-white border-t w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center justify-center">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} Modo Relax. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;