import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowRight, Users, Target, Award, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              À propos d'<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Anomalya Corp</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Découvrez notre histoire, notre mission et les valeurs qui nous animent dans notre quête d'innovation technologique.
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Notre Mission</h2>
                <p className="text-gray-400 leading-relaxed">
                  Démocratiser l'accès aux technologies innovantes en proposant des solutions personnalisées, 
                  accessibles et performantes pour tous, des particuliers aux entreprises.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Nos Valeurs</h2>
                <p className="text-gray-400 leading-relaxed">
                  Innovation, transparence, excellence et accompagnement humain sont au cœur de notre approche. 
                  Nous croyons en une technologie au service de l'humain.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Story */}
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Notre Histoire</h2>
            <div className="prose prose-lg prose-invert max-w-none text-center">
              <p className="text-gray-300 leading-relaxed mb-6">
                Fondée en 2020, <span className="text-blue-400 font-semibold">Anomalya Corp</span> est née d'une 
                passion commune pour l'innovation technologique et du désir de rendre la technologie accessible à tous.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Basée à Pollestres dans les Pyrénées-Orientales, notre équipe pluridisciplinaire combine expertise 
                technique et approche humaine pour accompagner nos clients dans leur transformation numérique.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Aujourd'hui, nous sommes fiers d'avoir accompagné plus de 100 clients dans leurs projets, 
                des sites web aux solutions d'intelligence artificielle, en passant par la maintenance informatique.
              </p>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Notre <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Équipe</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alexandre Martin",
                  role: "Fondateur & CTO",
                  description: "Expert en développement web et IA, passionné par l'innovation technologique.",
                  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                },
                {
                  name: "Sarah Durand", 
                  role: "Lead Developer",
                  description: "Spécialiste en React et Node.js, elle transforme les idées en applications performantes.",
                  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
                },
                {
                  name: "Thomas Leroux",
                  role: "Expert Cybersécurité",
                  description: "Responsable de la sécurité de nos solutions, il garantit la protection de vos données.",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                }
              ].map((member, index) => (
                <Card key={index} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 text-center">
                  <CardContent className="p-6">
                    <img 
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-500/30"
                    />
                    <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                    <div className="text-blue-400 font-medium mb-3">{member.role}</div>
                    <p className="text-gray-400 text-sm">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { number: "2020", label: "Année de création", icon: "🚀" },
              { number: "100+", label: "Clients satisfaits", icon: "😊" },
              { number: "200+", label: "Projets réalisés", icon: "💼" },
              { number: "5+", label: "Années d'expérience", icon: "🏆" }
            ].map((stat, index) => (
              <Card key={index} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Rejoignez l'aventure Anomalya
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Faites partie de nos clients satisfaits et découvrez comment nous pouvons 
              transformer vos idées en réalité technologique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8">
                <Link to="/contact">
                  Commencer un projet
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-600 text-gray-300 hover:bg-slate-800 hover:border-blue-500 px-8">
                <Link to="/services">Découvrir nos services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;