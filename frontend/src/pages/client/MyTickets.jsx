import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { clientAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MessageSquare,
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Loader2,
  Calendar,
  Settings,
  CreditCard,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const MyTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await clientAPI.getTickets({ status: statusFilter });
        setTickets(response.data || []);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Erreur lors du chargement des tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [statusFilter]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'technical': return <Settings className="h-4 w-4 text-blue-400" />;
      case 'billing': return <CreditCard className="h-4 w-4 text-green-400" />;
      case 'general': return <HelpCircle className="h-4 w-4 text-purple-400" />;
      case 'feature_request': return <Lightbulb className="h-4 w-4 text-orange-400" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'technical': return 'Support Technique';
      case 'billing': return 'Facturation';
      case 'general': return 'Question Générale';
      case 'feature_request': return 'Demande de Fonctionnalité';
      default: return 'Général';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4 text-blue-400" />;
      case 'waiting_response': return <MessageCircle className="h-4 w-4 text-orange-400" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'closed': return <CheckCircle className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'waiting_response': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'in_progress': return 'En cours';
      case 'waiting_response': return 'En attente de réponse';
      case 'resolved': return 'Résolu';
      case 'closed': return 'Fermé';
      default: return 'Inconnu';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-500/20 text-green-300';
      case 'normal': return 'bg-blue-500/20 text-blue-300';
      case 'high': return 'bg-orange-500/20 text-orange-300';
      case 'urgent': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'low': return 'Basse';
      case 'normal': return 'Normale';
      case 'high': return 'Élevée';
      case 'urgent': return 'Urgente';
      default: return 'Normale';
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Chargement des tickets...</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Mes <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Tickets</span>
              </h1>
              <p className="text-gray-400">Suivez vos demandes de support et communications</p>
              
              {user?.role === 'admin' && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-300 text-sm">Mode Administrateur - Vue des tickets clients</span>
                  </div>
                </div>
              )}
            </div>
            
            <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <Link to="/client/tickets/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau ticket
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un ticket..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>
                
                <div className="w-full sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all" className="text-white hover:bg-slate-700">Tous les statuts</SelectItem>
                      <SelectItem value="open" className="text-white hover:bg-slate-700">Ouvert</SelectItem>
                      <SelectItem value="in_progress" className="text-white hover:bg-slate-700">En cours</SelectItem>
                      <SelectItem value="waiting_response" className="text-white hover:bg-slate-700">En attente</SelectItem>
                      <SelectItem value="resolved" className="text-white hover:bg-slate-700">Résolu</SelectItem>
                      <SelectItem value="closed" className="text-white hover:bg-slate-700">Fermé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          {error ? (
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-8 text-center">
                <div className="text-red-400 mb-2">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  {error}
                </div>
              </CardContent>
            </Card>
          ) : filteredTickets.length === 0 ? (
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Aucun ticket trouvé</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm || statusFilter !== 'all' ? 
                    'Aucun ticket ne correspond à vos critères de recherche.' :
                    'Vous n\'avez pas encore créé de ticket de support.'
                  }
                </p>
                <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <Link to="/client/tickets/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer mon premier ticket
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {ticket.title}
                          </h3>
                          <Badge className={`border ${getStatusColor(ticket.status)}`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(ticket.status)}
                              <span>{getStatusLabel(ticket.status)}</span>
                            </div>
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityLabel(ticket.priority)}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center">
                            {getCategoryIcon(ticket.category)}
                            <span className="ml-1">{getCategoryLabel(ticket.category)}</span>
                          </div>
                          {ticket.messages && ticket.messages.length > 0 && (
                            <div className="flex items-center">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              {ticket.messages.length} message{ticket.messages.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {ticket.assigned_to && (
                          <div className="text-right mr-2">
                            <div className="text-xs text-gray-400">Assigné à</div>
                            <div className="text-sm text-white">{ticket.assigned_to}</div>
                          </div>
                        )}
                        <Button asChild variant="outline" size="sm" className="border-slate-600 text-gray-300 hover:bg-slate-800">
                          <Link to={`/client/tickets/${ticket.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Last message preview */}
                    {ticket.messages && ticket.messages.length > 0 && (
                      <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">
                          Dernier message {ticket.messages[ticket.messages.length - 1].is_admin ? '(Support)' : '(Vous)'}:
                        </div>
                        <div 
                          className="text-sm text-white line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: ticket.messages[ticket.messages.length - 1].message }}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(ticket.messages[ticket.messages.length - 1].timestamp).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyTickets;