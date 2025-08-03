import React from 'react';
import { Zap, Shield, Users, Globe } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Zap,
      title: "Rapidité & Performance",
      description: "Des solutions optimisées pour une expérience fluide et rapide.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Sécurité Renforcée",
      description: "Des pratiques de cybersécurité de pointe pour protéger vos données.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Approche Humaine",
      description: "Un accompagnement personnalisé, à l'écoute de vos besoins.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Vision Globale",
      description: "Une expertise couvrant le web, l'IA, la maintenance et bien plus encore.",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pourquoi nous <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">choisir ?</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Découvrez les avantages qui font d'Anomalya Corp votre partenaire technologique de confiance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
                
                <div className="relative z-10 text-center space-y-4">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Prêt à transformer votre projet ?
            </h3>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Rejoignez nos clients satisfaits et découvrez comment nous pouvons 
              vous accompagner dans votre transformation numérique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg">
                Commencer maintenant
              </button>
              <button className="border border-slate-600 text-gray-300 hover:bg-slate-800 hover:border-blue-500 px-6 py-3 rounded-lg transition-all duration-300">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;