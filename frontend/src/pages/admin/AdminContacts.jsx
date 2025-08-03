import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { adminAPI } from '../../services/api';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar,
  User,
  Loader2,
  ExternalLink
} from 'lucide-react';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getContacts({ limit: 100 });
      setContacts(response.data || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const getServiceBadgeColor = (service) => {
    switch (service) {
      case 'web': return 'bg-blue-500';
      case 'ia': return 'bg-purple-500';
      case 'maintenance': return 'bg-green-500';
      case 'montage': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getServiceLabel = (service) => {
    switch (service) {
      case 'web': return 'Développement Web';
      case 'ia': return 'Intelligence Artificielle';
      case 'maintenance': return 'Maintenance & Réparation';
      case 'montage': return 'Montage PC';
      default: return 'Autre';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Messages de contact</h1>
          <p className="text-gray-400">Gérez les demandes de vos clients</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-1">
                    Total des messages
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {contacts.length}
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-1">
                    Aujourd'hui
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {contacts.filter(contact => 
                      new Date(contact.created_at).toDateString() === new Date().toDateString()
                    ).length}
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-1">
                    Cette semaine
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {contacts.filter(contact => {
                      const contactDate = new Date(contact.created_at);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return contactDate >= weekAgo;
                    }).length}
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Chargement des messages...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {contacts.map((contact) => (
              <Card key={contact.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-slate-800 rounded-lg">
                        <User className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{contact.nom}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <a 
                              href={`mailto:${contact.email}`}
                              className="hover:text-blue-400 transition-colors"
                            >
                              {contact.email}
                            </a>
                            <ExternalLink className="h-3 w-3" />
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(contact.created_at).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge 
                        className={`${getServiceBadgeColor(contact.service)} text-white`}
                      >
                        {getServiceLabel(contact.service)}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="border-slate-600 text-gray-300"
                      >
                        {contact.status || 'Nouveau'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Sujet :</h4>
                      <p className="text-gray-300">{contact.sujet}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">Message :</h4>
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {contact.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <a
                        href={`mailto:${contact.email}?subject=Re: ${contact.sujet}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        Répondre par email
                      </a>
                      
                      <a
                        href={`tel:${contact.phone || ''}`}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        Appeler
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {contacts.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Aucun message de contact pour le moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContacts;