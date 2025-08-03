import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { mockNews } from '../data/mock';
import { Calendar, Clock, ArrowRight, Pin } from 'lucide-react';

const NewsSection = () => {
  const featuredNews = mockNews.slice(0, 3);

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nos <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Actualités</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Restez informé des dernières innovations, tendances technologiques et actualités de notre entreprise.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredNews.map((article, index) => (
            <Card key={article.id} className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-blue-500/50 transition-all duration-300 group overflow-hidden ${
              index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
            }`}>
              {/* Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="bg-slate-900/80 text-white border-slate-600">
                    {article.category}
                  </Badge>
                  {article.isPinned && (
                    <Badge className="bg-red-500/90 text-white">
                      <Pin className="h-3 w-3 mr-1" />
                      Épinglée
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Meta */}
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

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-400 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {article.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs px-2 py-1 bg-slate-700 text-gray-300 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Author & Read More */}
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

        {/* View All Button */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="border-slate-600 text-gray-300 hover:bg-slate-800 hover:border-blue-500 px-8">
            <Link to="/actualites">
              Voir toutes les actualités
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;