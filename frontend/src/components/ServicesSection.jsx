import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { mockServices } from '../data/mock';
import { ArrowRight, Check } from 'lucide-react';

const ServicesSection = () => {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nos <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Des solutions complètes et personnalisées pour répondre à tous vos besoins technologiques.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {mockServices.map((service, index) => (
            <Card key={service.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-blue-500/50 transition-all duration-300 group overflow-hidden hover:transform hover:scale-105">
              <CardHeader className="text-center pb-4">
                {/* Icon */}
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="pt-4 border-t border-slate-700">
                  <div className="text-lg font-semibold text-blue-400 mb-3">
                    {service.price}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-slate-600 text-gray-300 hover:bg-slate-700 hover:border-blue-500 group/btn"
                  >
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Nos <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Compétences</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              'HTML / CSS',
              'JavaScript / React',
              'PHP / Laravel',
              'Python / IA',
              'Sécurité Informatique',
              'MySQL / MongoDB',
              'Cloud & DevOps',
              'WordPress & CMS'
            ].map((tech, index) => (
              <div 
                key={index}
                className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-center text-sm text-gray-300 hover:border-blue-500/50 hover:bg-slate-700 transition-all duration-300"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Un projet en tête ?
            </h3>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Discutons de vos besoins et trouvons ensemble la solution parfaite pour votre projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8">
                <Link to="/contact">Demander un devis</Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-800">
                <Link to="/services">Voir tous les services</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;