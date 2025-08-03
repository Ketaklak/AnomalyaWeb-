import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-3xl"></div>
          
          <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Prêt à démarrer votre <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">projet ?</span>
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Contactez-nous dès aujourd'hui pour discuter de vos besoins et obtenir un devis personnalisé. 
                    Notre équipe d'experts est là pour vous accompagner dans votre transformation numérique.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Phone className="h-5 w-5 text-blue-400" />
                    <span>07 83 31 45 14</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <span>contact@anomalya.fr</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    <span>25 rue des Iris, 66450 Pollestres</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 group">
                    <Link to="/contact">
                      Demander un devis
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-slate-600 text-gray-300 hover:bg-slate-800 hover:border-blue-500 px-8">
                    <Link to="/services">Découvrir nos services</Link>
                  </Button>
                </div>
              </div>

              {/* Right Content - Features Grid */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { title: "Réponse rapide", desc: "< 24h", icon: "⚡" },
                  { title: "Devis gratuit", desc: "Sans engagement", icon: "💰" },
                  { title: "Support 24/7", desc: "Toujours disponible", icon: "🔧" },
                  { title: "Expertise", desc: "5+ ans d'expérience", icon: "🎯" }
                ].map((item, index) => (
                  <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-4 text-center hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;