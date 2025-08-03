import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockServices } from '../data/mock';
import { ArrowRight, Check, Star, Zap } from 'lucide-react';

const Services = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nos <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Des solutions complètes et personnalisées pour répondre à tous vos besoins technologiques.
              De l'idée à la réalisation, nous vous accompagnons à chaque étape.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {mockServices.map((service, index) => (
              <Card key={service.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:border-blue-500/50 transition-all duration-300 group overflow-hidden">
                <CardHeader className="text-center pb-6">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <CardTitle className="text-2xl text-white group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-gray-400 leading-relaxed text-center">
                    {service.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-white flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-2" />
                      Fonctionnalités incluses :
                    </h4>
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3 text-gray-300">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-700">
                    <div className="text-center space-y-4">
                      <div className="text-2xl font-bold text-blue-400">
                        {service.price}
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold group/btn">
                        Demander un devis
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Process Section */}
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Notre <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Processus</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Analyse",
                  description: "Étude approfondie de vos besoins et objectifs"
                },
                {
                  step: "02", 
                  title: "Conception",
                  description: "Création d'un prototype et validation avec vous"
                },
                {
                  step: "03",
                  title: "Développement", 
                  description: "Réalisation technique avec suivi régulier"
                },
                {
                  step: "04",
                  title: "Déploiement",
                  description: "Mise en ligne et accompagnement post-lancement"
                }
              ].map((phase, index) => (
                <div key={index} className="text-center relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-bold text-xl mb-4">
                    {phase.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {phase.description}
                  </p>
                  
                  {/* Connector */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-30 transform -translate-x-8"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Technologies <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Maîtrisées</span>
            </h2>
            
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
                  className="bg-slate-800/50 border border-slate-600 rounded-xl p-4 text-center text-sm text-gray-300 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="font-medium">{tech}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Contactez-nous dès aujourd'hui pour discuter de vos besoins et obtenir un devis personnalisé gratuit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8">
                <Link to="/contact">
                  Demander un devis gratuit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-600 text-gray-300 hover:bg-slate-800 hover:border-blue-500 px-8">
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
            
            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8 pt-8 border-t border-slate-700">
              <div className="text-gray-400">
                <span className="font-semibold">Téléphone :</span> 07 83 31 45 14
              </div>
              <div className="text-gray-400">
                <span className="font-semibold">Email :</span> contact@anomalya.fr
              </div>
              <div className="text-gray-400">
                <span className="font-semibold">Délai :</span> Réponse sous 24h
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;