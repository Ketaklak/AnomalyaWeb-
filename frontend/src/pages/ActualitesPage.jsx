import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { newsAPI } from '../services/api';
import { Calendar, Clock, ArrowRight, Pin, Search, Loader2 } from 'lucide-react';

const ActualitesPage = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Load articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = {
          limit: 50,
          offset: 0,
          sort: sortBy
        };
        
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        const response = await newsAPI.getAll(params);
        setArticles(response.data.articles || []);
        setHasMore(response.data.hasMore || false);
        setTotal(response.data.total || 0);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Erreur lors du chargement des articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [searchQuery, selectedCategory, sortBy]);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await newsAPI.getCategories();
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Separate pinned articles
  const pinnedArticles = articles.filter(article => article.isPinned);
  const regularArticles = articles.filter(article => !article.isPinned);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 to-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Nos <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Actualités</span>
              </h1>
            </div>
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Chargement des actualités...</span>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nos <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Actualités</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Restez informé des dernières innovations, tendances technologiques et actualités de notre entreprise.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-gray-400"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">
                    Toutes les catégories
                  </SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-slate-700">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="date" className="text-white hover:bg-slate-700">Plus récent</SelectItem>
                  <SelectItem value="title" className="text-white hover:bg-slate-700">Titre A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="text-center mb-12">
              <div className="text-red-400 mb-4">{error}</div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Réessayer
              </Button>
            </div>
          )}

          {/* Pinned Articles */}
          {pinnedArticles.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Pin className="mr-2 h-6 w-6 text-red-400" />
                Articles épinglés
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {pinnedArticles.map((article) => (
                  <Card key={article.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:border-blue-500/50 transition-all duration-300 group overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge variant="secondary" className="bg-slate-900/80 text-white border-slate-600">
                          {article.category}
                        </Badge>
                        <Badge className="bg-red-500/90 text-white">
                          <Pin className="h-3 w-3 mr-1" />
                          Épinglée
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>

                        <p className="text-gray-400 line-clamp-3">
                          {article.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {article.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-xs px-2 py-1 bg-slate-700 text-gray-300 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm text-gray-500">Par {article.author}</span>
                          <Link 
                            to={`/news/${article.id}`}
                            className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors group/link"
                          >
                            Lire la suite
                            <ArrowRight className="ml-1 h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular Articles */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">
              Tous les articles ({total})
            </h2>
            {regularArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularArticles.map((article) => (
                  <Card key={article.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:border-blue-500/50 transition-all duration-300 group overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-slate-900/80 text-white border-slate-600">
                          {article.category}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-gray-400 line-clamp-3">
                          {article.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {article.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-xs px-2 py-1 bg-slate-700 text-gray-300 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm text-gray-500">Par {article.author}</span>
                          <Link 
                            to={`/news/${article.id}`}
                            className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors group/link"
                          >
                            Lire la suite
                            <ArrowRight className="ml-1 h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
                  <p>Essayez de modifier vos critères de recherche.</p>
                </div>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  variant="outline" 
                  className="border-slate-600 text-gray-300 hover:bg-slate-800"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ActualitesPage;