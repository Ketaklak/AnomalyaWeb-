import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { clientAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { 
  MessageSquare, 
  Send, 
  Loader2,
  AlertCircle,
  HelpCircle,
  Settings,
  Zap,
  CreditCard,
  Lightbulb
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CreateTicket = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'normal'
  });

  const categories = [
    {
      value: 'technical',
      label: 'Support Technique',
      icon: Settings,
      description: 'Problèmes techniques, bugs, dysfonctionnements',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      value: 'billing',
      label: 'Facturation',
      icon: CreditCard,
      description: 'Questions sur les factures, paiements, tarifs',
      color: 'from-green-500 to-emerald-500'
    },
    {
      value: 'general',
      label: 'Question Générale',
      icon: HelpCircle,
      description: 'Informations générales, questions diverses',
      color: 'from-purple-500 to-pink-500'
    },
    {
      value: 'feature_request',
      label: 'Demande de Fonctionnalité',
      icon: Lightbulb,
      description: 'Suggestions d\'améliorations, nouvelles fonctionnalités',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const priorities = [
    { value: 'low', label: 'Basse', color: 'bg-green-500', description: 'Question non urgente' },
    { value: 'normal', label: 'Normale', color: 'bg-blue-500', description: 'Demande standard' },
    { value: 'high', label: 'Élevée', color: 'bg-orange-500', description: 'Problème important' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-500', description: 'Problème critique' }
  ];

  const selectedCategory = categories.find(cat => cat.value === formData.category);
  const selectedPriority = priorities.find(p => p.value === formData.priority);

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
      if (!formData.title || !formData.description || !formData.category) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const response = await clientAPI.createTicket(formData);

      if (response.data.success) {
        toast({
          title: "Ticket créé avec succès !",
          description: "Votre demande a été transmise à notre équipe. Nous vous répondrons rapidement.",
        });
        navigate('/client/tickets');
      } else {
        throw new Error('Erreur lors de la création du ticket');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du ticket.",
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
              Créer un <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Ticket</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Contactez notre équipe de support pour toute question ou demande d'assistance
            </p>
            
            {user?.role === 'admin' && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-300 text-sm">Mode Administrateur - Test du système de tickets</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Category Selection */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Type de demande *</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = formData.category === category.value;
                    
                    return (
                      <div
                        key={category.value}
                        onClick={() => handleInputChange('category', category.value)}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-base mb-2">
                              {category.label}
                            </h3>
                            <p className="text-sm text-gray-400">
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

            {/* Ticket Details */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Détails de votre demande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Objet *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Résumé de votre demande en quelques mots"
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
                    placeholder="Décrivez votre problème ou votre demande en détail. Plus vous donnez d'informations, plus nous pourrons vous aider efficacement."
                    className="bg-slate-800 border-slate-600 text-white resize-none"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Priorité
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {priorities.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => handleInputChange('priority', priority.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          formData.priority === priority.value
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                          <span className="text-white text-sm font-medium">{priority.label}</span>
                        </div>
                        <p className="text-xs text-gray-400">{priority.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            {selectedCategory && (
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Résumé de votre ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedCategory.color}`}>
                        <selectedCategory.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">{selectedCategory.label}</div>
                        <div className="text-gray-400 text-sm">{selectedCategory.description}</div>
                      </div>
                    </div>
                    
                    {formData.title && (
                      <div>
                        <span className="text-gray-400">Objet: </span>
                        <span className="text-white">{formData.title}</span>
                      </div>
                    )}
                    
                    {selectedPriority && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">Priorité: </span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${selectedPriority.color}`} />
                          <span className="text-white">{selectedPriority.label}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={loading || !formData.title || !formData.description || !formData.category}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Créer le ticket
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

            {/* Support Info */}
            <Card className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Temps de réponse</h4>
                    <p className="text-blue-200 text-sm">
                      Notre équipe s'engage à répondre à votre ticket dans les <strong>24 heures</strong> pour 
                      les demandes normales et dans les <strong>4 heures</strong> pour les demandes urgentes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateTicket;