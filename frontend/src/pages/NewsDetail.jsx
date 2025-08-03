import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { newsAPI } from '../services/api';
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const NewsDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await newsAPI.getById(id);
        setArticle(response);

        // Fetch related articles
        if (response.category) {
          const relatedResponse = await newsAPI.getAll({
            category: response.category,
            limit: 4
          });
          const filtered = relatedResponse.articles.filter(a => a.id !== response.id).slice(0, 2);
          setRelatedArticles(filtered);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Article non trouvé ou erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié !",
        description: "Le lien de l'article a été copié dans le presse-papiers.",
      });
    }
  };

  const handleBookmark = () => {
    toast({
      title: "Article sauvegardé !",
      description: "L'article a été ajouté à vos favoris.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 to-slate-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Chargement de l'article...</span>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 to-slate-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-2xl mb-4">{error || 'Article non trouvé'}</h1>
            <Button asChild>
              <Link to="/actualites">Retour aux actualités</Link>
            </Button>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button asChild variant="outline" className="mb-8 border-slate-600 text-gray-300 hover:bg-slate-800">
            <Link to="/actualites">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux actualités
            </Link>
          </Button>

          {/* Article Header */}
          <div className="space-y-6">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <Badge variant="secondary" className="bg-slate-800 text-white border-slate-600">
                {article.category}
              </Badge>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.date).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime} de lecture</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Par {article.author}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-400 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span key={index} className="text-sm px-3 py-1 bg-slate-800 text-gray-300 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button onClick={handleShare} variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-800">
                <Share2 className="mr-2 h-4 w-4" />
                Partager
              </Button>
              <Button onClick={handleBookmark} variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-800">
                <Bookmark className="mr-2 h-4 w-4" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Image */}
          <div className="mb-12">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
          </div>

          {/* Article Body */}
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed space-y-6">
              {article.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{paragraph.replace('# ', '')}</h1>;
                } else if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
                } else if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-bold text-white mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
                } else if (paragraph.startsWith('- ')) {
                  return <li key={index} className="ml-4">{paragraph.replace('- ', '')}</li>;
                } else if (paragraph.trim() === '') {
                  return <br key={index} />;
                } else {
                  return <p key={index} className="mb-4">{paragraph}</p>;
                }
              })}
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-16 pt-8 border-t border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-8">Articles similaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link key={relatedArticle.id} to={`/news/${relatedArticle.id}`} className="group">
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
                      <img 
                        src={relatedArticle.image} 
                        alt={relatedArticle.title}
                        className="w-full h-32 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                      />
                      <h4 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                        {relatedArticle.title}
                      </h4>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(relatedArticle.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewsDetail;