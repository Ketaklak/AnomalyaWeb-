import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Zap,
  ChevronDown
} from 'lucide-react';

/**
 * Template de page personnalisée
 * Utilisez ce template comme base pour créer de nouvelles pages
 */
const CustomPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Données d'exemple - remplacez par vos vraies données
  const features = [
    {
      icon: Zap,
      title: "Performance Optimale",
      description: "Technologies modernes pour une performance maximale"
    },
    {
      icon: Users,
      title: "Équipe Experte",
      description: "Des développeurs expérimentés à votre service"
    },
    {
      icon: CheckCircle,
      title: "Qualité Garantie",
      description: "Code testé et documentation complète"
    }
  ];

  const stats = [
    { number: "100+", label: "Projets Réalisés" },
    { number: "50+", label: "Clients Satisfaits" },
    { number: "99%", label: "Disponibilité" },
    { number: "24h", label: "Support Technique" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      <main className="pt-20">
        {/* Section Héro */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Fond animé */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20"></div>
          
          <div className="relative max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Titre de Votre
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Page Personnalisée
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Description engageante de votre page. Expliquez clairement la valeur 
              que vous apportez et pourquoi les visiteurs devraient s'intéresser 
              à votre contenu.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Action Principale
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300">
                Action Secondaire
              </Button>
            </div>
          </div>
        </section>

        {/* Section Statistiques */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Fonctionnalités */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Nos Avantages
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Découvrez pourquoi nous sommes le choix idéal pour vos projets
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="bg-slate-900/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300">
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-blue-400" />
                      </div>
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section Contenu Tabulé */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Contenu */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Section Détaillée
                </h2>
                
                <div className="space-y-4">
                  {[
                    "Fonctionnalité avancée avec description détaillée",
                    "Intégration complète avec vos systèmes existants", 
                    "Support technique 24/7 et maintenance continue",
                    "Évolutivité garantie pour accompagner votre croissance"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>

                <Button className="mt-8 bg-blue-600 hover:bg-blue-700">
                  En Savoir Plus
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Image ou Graphique */}
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-slate-700 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-blue-400" />
                    </div>
                    <p className="text-gray-300">
                      Emplacement pour image, graphique ou diagramme
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section FAQ ou Questions */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Questions Fréquentes
            </h2>

            <div className="space-y-4">
              {[
                {
                  question: "Comment personnaliser cette page ?",
                  answer: "Modifiez le contenu, les couleurs et les composants selon vos besoins. Toutes les données sont configurables."
                },
                {
                  question: "Puis-je ajouter d'autres sections ?",
                  answer: "Absolument ! Ce template est entièrement modulaire. Ajoutez, supprimez ou réorganisez les sections."
                },
                {
                  question: "Le design est-il responsive ?",
                  answer: "Oui, le template utilise Tailwind CSS et est optimisé pour tous les écrans."
                }
              ].map((faq, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-700">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => setActiveSection(activeSection === index ? -1 : index)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">
                        {faq.question}
                      </CardTitle>
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          activeSection === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </CardHeader>
                  {activeSection === index && (
                    <CardContent>
                      <p className="text-gray-300">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section CTA Final */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à Commencer ?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Contactez-nous dès aujourd'hui pour discuter de votre projet
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Nous Contacter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/services">
                <Button variant="outline" size="lg" className="border-gray-600 text-gray-300">
                  Voir Nos Services
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CustomPage;