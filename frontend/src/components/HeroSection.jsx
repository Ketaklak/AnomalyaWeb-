import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, Zap, Code, Shield, Users } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Hero Badge */}
          <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full px-4 py-2 text-sm text-gray-300">
            <Zap className="h-4 w-4 text-blue-400" />
            <span>Innovation Numérique 2025</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              L'Innovation
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Numérique
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Chez <span className="text-blue-400 font-semibold">Anomalya Corp</span>, nous croyons que la technologie est le moteur du progrès. 
              Notre objectif : simplifier et optimiser votre quotidien, que vous soyez un particulier ou une entreprise.
            </p>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Grâce à une équipe pluridisciplinaire, nous proposons des solutions de développement web, 
            de maintenance informatique, d'intelligence artificielle et de montage PC. 
            Ensemble, bâtissons un avenir où l'innovation est à la portée de tous.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-3 text-lg group">
              <Link to="/services">
                Découvrir nos services
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-600 text-gray-300 hover:bg-slate-800 px-8 py-3 text-lg">
              <Link to="/contact">Devis Gratuit</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800/50 rounded-lg mb-3 group-hover:bg-blue-500/20 transition-colors">
                <Code className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-sm text-gray-400">Projets réalisés</div>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800/50 rounded-lg mb-3 group-hover:bg-cyan-500/20 transition-colors">
                <Users className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-sm text-gray-400">Clients satisfaits</div>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800/50 rounded-lg mb-3 group-hover:bg-blue-500/20 transition-colors">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">99%</div>
              <div className="text-sm text-gray-400">Disponibilité</div>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800/50 rounded-lg mb-3 group-hover:bg-cyan-500/20 transition-colors">
                <Zap className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white">24h</div>
              <div className="text-sm text-gray-400">Support technique</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;