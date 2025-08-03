import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      service: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      
      // Reset form
      setFormData({
        nom: '',
        email: '',
        sujet: '',
        service: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contactez-<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">nous</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discutons de votre projet et trouvons ensemble la solution parfaite pour vos besoins technologiques.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center">
                    <MessageCircle className="mr-3 h-6 w-6 text-blue-400" />
                    Envoyez-nous un message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nom complet *
                        </label>
                        <Input
                          name="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          required
                          placeholder="Votre nom"
                          className="bg-slate-800 border-slate-600 text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="votre@email.com"
                          className="bg-slate-800 border-slate-600 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Sujet *
                        </label>
                        <Input
                          name="sujet"
                          value={formData.sujet}
                          onChange={handleInputChange}
                          required
                          placeholder="Sujet de votre message"
                          className="bg-slate-800 border-slate-600 text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Service concerné
                        </label>
                        <Select value={formData.service} onValueChange={handleSelectChange}>
                          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                            <SelectValue placeholder="Choisissez un service" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="web" className="text-white hover:bg-slate-700">Développement Web</SelectItem>
                            <SelectItem value="ia" className="text-white hover:bg-slate-700">Intelligence Artificielle</SelectItem>
                            <SelectItem value="maintenance" className="text-white hover:bg-slate-700">Maintenance & Réparation</SelectItem>
                            <SelectItem value="montage" className="text-white hover:bg-slate-700">Montage PC</SelectItem>
                            <SelectItem value="autre" className="text-white hover:bg-slate-700">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Message *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        placeholder="Décrivez votre projet ou votre demande..."
                        className="bg-slate-800 border-slate-600 text-white placeholder-gray-400 resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Contact Details */}
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Informations de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Téléphone</div>
                      <div className="text-gray-400">07 83 31 45 14</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Email</div>
                      <div className="text-gray-400">contact@anomalya.fr</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Adresse</div>
                      <div className="text-gray-400">25 rue des Iris<br />66450 Pollestres</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Horaires</div>
                      <div className="text-gray-400">Lun-Ven : 9h30 - 18h</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Response */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Réponse rapide</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Nous nous engageons à vous répondre sous 24h maximum.
                  </p>
                  <div className="text-blue-400 font-semibold">Disponible 7j/7</div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Urgence ?</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Pour les demandes urgentes, appelez-nous directement.
                  </p>
                  <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <a href="tel:0783314514">
                      <Phone className="mr-2 h-4 w-4" />
                      Appeler maintenant
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;