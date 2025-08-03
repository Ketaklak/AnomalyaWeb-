import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { clientAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';
import { 
  Globe, 
  Smartphone, 
  Brain, 
  Shield, 
  Users, 
  Wrench,
  GraduationCap,
  Send,
  Loader2,
  Calendar,
  DollarSign
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const RequestQuote = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service_category: '',
    title: '',
    description: '',
    budget_range: '',
    deadline: '',
    priority: 'normal'
  });

  const serviceCategories = [
    {
      value: 'Développement Web',
      label: 'Développement Web',
      icon: Globe,
      description: 'Sites web, applications web, e-commerce',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      value: 'Application Mobile',
      label: 'Application Mobile',
      icon: Smartphone,
      description: 'Apps iOS, Android, React Native',
      color: 'from-green-500 to-emerald-500'
    },
    {
      value: 'Intelligence Artificielle',
      label: 'Intelligence Artificielle',
      icon: Brain,
      description: 'IA, ML, chatbots, automatisation',
      color: 'from-purple-500 to-pink-500'
    },
    {
      value: 'Cybersécurité',
      label: 'Cybersécurité',
      icon: Shield,
      description: 'Audit, protection, conformité',
      color: 'from-red-500 to-orange-500'
    },
    {
      value: 'Conseil IT',
      label: 'Conseil IT',
      icon: Users,
      description: 'Stratégie, architecture, transformation',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      value: 'Maintenance',
      label: 'Maintenance',
      icon: Wrench,
      description: 'Support, maintenance, évolutions',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      value: 'Formation',
      label: 'Formation',
      icon: GraduationCap,
      description: 'Formation équipes, workshops',
      color: 'from-teal-500 to-blue-500'
    }
  ];

  const budgetRanges = [
    '< 5 000€',
    '5 000€ - 15 000€',
    '15 000€ - 50 000€',
    '50 000€ - 100 000€',
    '> 100 000€',
    'À définir'
  ];

  const priorities = [
    { value: 'low', label: 'Basse', color: 'bg-green-500' },
    { value: 'normal', label: 'Normale', color: 'bg-blue-500' },
    { value: 'high', label: 'Élevée', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-500' }
  ];

  const selectedService = serviceCategories.find(cat => cat.value === formData.service_category);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.service_category || !formData.title || !formData.description) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const quoteData = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
      };

      const response = await clientAPI.createQuote(quoteData);

      if (response.data.success) {
        toast({
          title: "Demande de devis envoyée !",
          description: "Votre demande a été transmise à notre équipe. Nous vous recontacterons sous 24h.",
        });
        navigate('/client/quotes');
      } else {
        throw new Error('Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de votre demande.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Demande de <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Devis</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Décrivez votre projet en détail pour recevoir un devis personnalisé de notre équipe d'experts
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Category Selection */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Type de service *</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {serviceCategories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = formData.service_category === category.value;
                    
                    return (
                      <div
                        key={category.value}
                        onClick={() => handleInputChange('service_category', category.value)}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                        }`}
                      >
                        <div className="text-center space-y-3">
                          <div className={`w-12 h-12 mx-auto rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm mb-1">
                              {category.label}
                            </h3>
                            <p className="text-xs text-gray-400">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Détails du projet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Titre du projet *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Développement d'une plateforme e-commerce"
                    className="bg-slate-800 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description détaillée *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Décrivez votre projet en détail : fonctionnalités souhaitées, technologies préférées, contraintes spécifiques..."
                    className="bg-slate-800 border-slate-600 text-white resize-none"
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <DollarSign className="inline h-4 w-4 mr-1" />
                      Budget approximatif
                    </label>
                    <Select
                      value={formData.budget_range}
                      onValueChange={(value) => handleInputChange('budget_range', value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Sélectionnez votre budget" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {budgetRanges.map((range) => (
                          <SelectItem key={range} value={range} className="text-white hover:bg-slate-700">
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Date souhaitée de livraison
                    </label>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Priorité du projet
                  </label>
                  <div className="flex space-x-3">
                    {priorities.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => handleInputChange('priority', priority.value)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          formData.priority === priority.value
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                          <span className="text-white text-sm">{priority.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            {selectedService && (
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Résumé de votre demande</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedService.color}`}>
                        <selectedService.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">{selectedService.label}</div>
                        <div className="text-gray-400 text-sm">{selectedService.description}</div>
                      </div>
                    </div>
                    
                    {formData.title && (
                      <div>
                        <span className="text-gray-400">Titre: </span>
                        <span className="text-white">{formData.title}</span>
                      </div>
                    )}
                    
                    <div className="flex space-x-4">
                      {formData.budget_range && (
                        <Badge variant="outline" className="border-slate-600 text-gray-300">
                          Budget: {formData.budget_range}
                        </Badge>
                      )}
                      {formData.priority && (
                        <Badge variant="outline" className="border-slate-600 text-gray-300">
                          Priorité: {priorities.find(p => p.value === formData.priority)?.label}
                        </Badge>
                      )}
                      {formData.deadline && (
                        <Badge variant="outline" className="border-slate-600 text-gray-300">
                          Échéance: {new Date(formData.deadline).toLocaleDateString('fr-FR')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={loading || !formData.service_category || !formData.title || !formData.description}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer la demande
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/client/dashboard')}
                className="border-slate-600 text-gray-300 hover:bg-slate-800"
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RequestQuote;