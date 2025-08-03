import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { testimonialsAPI } from '../services/api';
import { Star, Quote, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await testimonialsAPI.getAll();
        setTestimonials(response || []);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Erreur lors du chargement des témoignages');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return (
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Témoignages de nos <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">clients</span>
            </h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Chargement des témoignages...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || testimonials.length === 0) {
    return (
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Témoignages de nos <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">clients</span>
            </h2>
            <div className="text-gray-400 mb-8">
              {error || 'Aucun témoignage disponible pour le moment.'}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Témoignages de nos <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">clients</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Découvrez ce que nos clients pensent de nos services et de notre accompagnement.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="text-center space-y-6">
                {/* Quote Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
                  <Quote className="h-8 w-8 text-white" />
                </div>

                {/* Testimonial Content */}
                <div className="space-y-6">
                  <blockquote className="text-xl md:text-2xl text-gray-300 leading-relaxed font-medium">
                    "{currentTestimonial.content}"
                  </blockquote>

                  {/* Rating */}
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${
                          i < currentTestimonial.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-600'
                        }`} 
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-center space-x-4">
                    <img 
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-blue-500/30"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-white text-lg">
                        {currentTestimonial.name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {currentTestimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700 hover:border-blue-500"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700 hover:border-blue-500"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {testimonials.length > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 scale-125' 
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center bg-slate-900/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-2">100+</div>
            <div className="text-gray-400">Clients satisfaits</div>
          </div>
          <div className="text-center bg-slate-900/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-gray-400">Note moyenne</div>
          </div>
          <div className="text-center bg-slate-900/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-2">98%</div>
            <div className="text-gray-400">Recommandations</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;