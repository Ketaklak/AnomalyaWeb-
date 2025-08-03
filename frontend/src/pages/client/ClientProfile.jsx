import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { clientAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin,
  Save,
  Loader2,
  Settings,
  Bell,
  Globe
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ClientProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
    company_name: '',
    company_industry: '',
    company_size: '',
    job_title: '',
    preferred_language: 'fr',
    newsletter_subscribed: false,
    sms_notifications: false,
    email_notifications: true
  });

  const companySizes = [
    'Indépendant / Freelance',
    'TPE (1-9 salariés)',
    'PME (10-249 salariés)',
    'ETI (250-4999 salariés)',
    'Grande entreprise (5000+ salariés)'
  ];

  const industries = [
    'Technologie',
    'Finance',
    'Santé',
    'E-commerce',
    'Éducation',
    'Manufacturing',
    'Services',
    'Consulting',
    'Média',
    'Immobilier',
    'Autre'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await clientAPI.getProfile();
        const profileData = response.data;
        
        setProfile(profileData);
        setFormData({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          city: profileData.city || '',
          postal_code: profileData.postal_code || '',
          country: profileData.country || 'France',
          company_name: profileData.company_name || '',
          company_industry: profileData.company_industry || '',
          company_size: profileData.company_size || '',
          job_title: profileData.job_title || '',
          preferred_language: profileData.preferred_language || 'fr',
          newsletter_subscribed: profileData.newsletter_subscribed || false,
          sms_notifications: profileData.sms_notifications || false,
          email_notifications: profileData.email_notifications !== false // true par défaut
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await clientAPI.createProfile(formData);

      if (response.data.success) {
        toast({
          title: "Profil mis à jour !",
          description: "Vos informations ont été sauvegardées avec succès.",
        });
        
        // Refresh profile data
        const updatedResponse = await clientAPI.getProfile();
        setProfile(updatedResponse.data);
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Chargement du profil...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center text-red-400">
              <p>{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Mon <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Profil</span>
            </h1>
            <p className="text-gray-400">
              {user?.role === 'admin' ? 
                'Interface profil client - Mode administrateur' : 
                'Gérez vos informations personnelles et préférences'
              }
            </p>
            
            {/* Admin Notice */}
            {user?.role === 'admin' && (
              <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-orange-300 text-sm font-medium">Profil Administrateur</span>
                </div>
                <p className="text-orange-200 text-sm mt-2">
                  Ce profil contient des données par défaut pour les administrateurs. 
                  Les modifications seront sauvegardées dans votre profil admin.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-400" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Prénom *
                    </label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      placeholder="Votre prénom"
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nom *
                    </label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      placeholder="Votre nom"
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email
                    </label>
                    <Input
                      value={user?.email || ''}
                      disabled
                      className="bg-slate-800 border-slate-600 text-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      L'email ne peut pas être modifié depuis cette page
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Téléphone
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+33 1 23 45 67 89"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Adresse
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Rue de la Paix"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ville
                    </label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Paris"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Code postal
                    </label>
                    <Input
                      value={formData.postal_code}
                      onChange={(e) => handleInputChange('postal_code', e.target.value)}
                      placeholder="75001"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pays
                    </label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleInputChange('country', value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="France" className="text-white hover:bg-slate-700">France</SelectItem>
                        <SelectItem value="Belgique" className="text-white hover:bg-slate-700">Belgique</SelectItem>
                        <SelectItem value="Suisse" className="text-white hover:bg-slate-700">Suisse</SelectItem>
                        <SelectItem value="Canada" className="text-white hover:bg-slate-700">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Building className="mr-2 h-5 w-5 text-green-400" />
                  Informations entreprise
                  <span className="ml-2 text-sm text-gray-400 font-normal">(Optionnel)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nom de l'entreprise
                    </label>
                    <Input
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      placeholder="Anomalya Corp"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Votre poste
                    </label>
                    <Input
                      value={formData.job_title}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                      placeholder="Directeur IT"
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Secteur d'activité
                    </label>
                    <Select
                      value={formData.company_industry}
                      onValueChange={(value) => handleInputChange('company_industry', value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Sélectionnez un secteur" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry} className="text-white hover:bg-slate-700">
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Taille de l'entreprise
                    </label>
                    <Select
                      value={formData.company_size}
                      onValueChange={(value) => handleInputChange('company_size', value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Sélectionnez la taille" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size} className="text-white hover:bg-slate-700">
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-purple-400" />
                  Préférences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Globe className="inline h-4 w-4 mr-1" />
                    Langue préférée
                  </label>
                  <Select
                    value={formData.preferred_language}
                    onValueChange={(value) => handleInputChange('preferred_language', value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="fr" className="text-white hover:bg-slate-700">🇫🇷 Français</SelectItem>
                      <SelectItem value="en" className="text-white hover:bg-slate-700">🇺🇸 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium flex items-center">
                    <Bell className="mr-2 h-4 w-4 text-orange-400" />
                    Notifications
                  </h4>
                  
                  <div className="space-y-4 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm">Notifications par email</div>
                        <div className="text-gray-400 text-xs">Recevoir les mises à jour importantes par email</div>
                      </div>
                      <Switch
                        checked={formData.email_notifications}
                        onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm">Notifications SMS</div>
                        <div className="text-gray-400 text-xs">Recevoir les alertes urgentes par SMS</div>
                      </div>
                      <Switch
                        checked={formData.sms_notifications}
                        onCheckedChange={(checked) => handleInputChange('sms_notifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm">Newsletter</div>
                        <div className="text-gray-400 text-xs">Recevoir notre newsletter mensuelle</div>
                      </div>
                      <Switch
                        checked={formData.newsletter_subscribed}
                        onCheckedChange={(checked) => handleInputChange('newsletter_subscribed', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientProfile;