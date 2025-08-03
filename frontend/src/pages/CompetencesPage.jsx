import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { mockCompetences } from '../data/mock';
import { Code, Database, Shield, Cloud, Palette, Zap, ArrowRight } from 'lucide-react';

const CompetencesPage = () => {
  const getIconForCategory = (category) => {
    switch (category) {
      case 'Frontend': return <Code className="h-6 w-6" />;
      case 'Backend': return <Database className="h-6 w-6" />;
      case 'Database': return <Database className="h-6 w-6" />;
      case 'Sécurité': return <Shield className="h-6 w-6" />;
      case 'Infrastructure': return <Cloud className="h-6 w-6" />;
      case 'CMS': return <Palette className="h-6 w-6" />;
      case 'IA': return <Zap className="h-6 w-6" />;
      default: return <Code className="h-6 w-6" />;
    }
  };

  const getColorForCategory = (category) => {
    switch (category) {
      case 'Frontend': return 'from-blue-500 to-cyan-500';
      case 'Backend': return 'from-green-500 to-emerald-500';
      case 'Database': return 'from-purple-500 to-pink-500';
      case 'Sécurité': return 'from-red-500 to-orange-500';
      case 'Infrastructure': return 'from-yellow-500 to-amber-500';
      case 'CMS': return 'from-indigo-500 to-blue-500';
      case 'IA': return 'from-cyan-500 to-teal-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const groupedCompetences = mockCompetences.reduce((acc, comp) => {
    if (!acc[comp.category]) {
      acc[comp.category] = [];
    }
    acc[comp.category].push(comp);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nos <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Compétences</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Découvrez notre expertise technique et nos domaines de spécialisation. 
              Une équipe polyvalente pour tous vos projets technologiques.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Skills by Category */}
          <div className="space-y-12">
            {Object.entries(groupedCompetences).map(([category, skills]) => (
              <div key={category}>
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center">
                      <div className={`p-3 bg-gradient-to-r ${getColorForCategory(category)} rounded-lg mr-4`}>
                        {getIconForCategory(category)}
                      </div>
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {skills.map((skill, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">{skill.name}</span>
                            <span className="text-gray-400 text-sm">{skill.level}%</span>
                          </div>
                          <Progress 
                            value={skill.level} 
                            className="h-2 bg-slate-700"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Certifications & Experience */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
            {/* Experience */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Zap className="mr-3 h-6 w-6 text-blue-400" />
                  Expérience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    title: "Développement Web",
                    experience: "5+ années",
                    projects: "50+ projets réalisés",
                    description: "Sites vitrine, e-commerce, applications web"
                  },
                  {
                    title: "Intelligence Artificielle",
                    experience: "3+ années",
                    projects: "20+ projets IA",
                    description: "Machine Learning, NLP, Computer Vision"
                  },
                  {
                    title: "Cybersécurité",
                    experience: "4+ années",
                    projects: "100+ audits",
                    description: "Pentesting, analyse de vulnérabilités"
                  }
                ].map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 space-y-2">
                    <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>{exp.experience}</span>
                      <span>•</span>
                      <span>{exp.projects}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{exp.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tools & Technologies */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Code className="mr-3 h-6 w-6 text-cyan-400" />
                  Outils & Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      category: "Développement",
                      tools: ["VS Code", "Git", "Docker", "Postman", "Figma"]
                    },
                    {
                      category: "Frameworks", 
                      tools: ["React", "Laravel", "FastAPI", "Express", "Vue.js"]
                    },
                    {
                      category: "Bases de données",
                      tools: ["MySQL", "MongoDB", "PostgreSQL", "Redis"]
                    },
                    {
                      category: "Cloud & DevOps",
                      tools: ["AWS", "Google Cloud", "Azure", "Kubernetes", "Jenkins"]
                    },
                    {
                      category: "IA & ML",
                      tools: ["TensorFlow", "PyTorch", "OpenAI API", "Hugging Face"]
                    }
                  ].map((toolGroup, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-white mb-3">{toolGroup.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {toolGroup.tools.map((tool, toolIndex) => (
                          <span 
                            key={toolIndex}
                            className="px-3 py-1 bg-slate-800 text-gray-300 text-sm rounded-full border border-slate-600 hover:border-blue-500/50 transition-colors"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { number: "5+", label: "Années d'expérience", icon: "📅" },
              { number: "100+", label: "Projets réalisés", icon: "🚀" },
              { number: "50+", label: "Clients satisfaits", icon: "😊" },
              { number: "24/7", label: "Support technique", icon: "🔧" }
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

          {/* CTA Section */}
          <div className="mt-16 text-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Impressed par nos compétences ?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Mettons notre expertise à votre service pour réaliser vos projets les plus ambitieux.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8">
                <Link to="/contact">
                  Discutons de votre projet
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-600 text-gray-300 hover:bg-slate-800 hover:border-blue-500 px-8">
                <Link to="/services">Voir nos services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CompetencesPage;