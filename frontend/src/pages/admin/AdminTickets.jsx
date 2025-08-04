import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { adminAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { 
  MessageSquare,
  Search, 
  Filter, 
  Eye, 
  Reply,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Calendar,
  User,
  Settings,
  CreditCard,
  HelpCircle,
  Lightbulb,
  Loader2,
  Send,
  UserCheck
} from 'lucide-react';

const AdminTickets = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getSupportTickets({ 
          status: statusFilter,
          priority: priorityFilter 
        });
        setTickets(response.data || []);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        toast({
          title: "Erreur",
          description: "Impossible de charger les tickets de support.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [statusFilter, priorityFilter, toast]);

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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'technical': return 'from-blue-500 to-cyan-500';
      case 'billing': return 'from-green-500 to-emerald-500';
      case 'general': return 'from-purple-500 to-pink-500';
      case 'feature_request': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-slate-500';
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

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un message.",
        variant: "destructive"
      });
      return;
    }

    setSendingReply(true);
    try {
      const response = await adminAPI.addTicketMessage(selectedTicket.id, replyMessage);

      if (response.data.success) {
        toast({
          title: "Réponse envoyée !",
          description: "Votre message a été envoyé au client."
        });

        // Refresh tickets list
        const updatedResponse = await adminAPI.getSupportTickets({ 
          status: statusFilter,
          priority: priorityFilter 
        });
        setTickets(updatedResponse.data || []);
        
        // Reset form and close dialog
        setReplyMessage('');
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la réponse.",
        variant: "destructive"
      });
    } finally {
      setSendingReply(false);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openTicketsCount = tickets.filter(t => ['open', 'in_progress'].includes(t.status)).length;
  const urgentTicketsCount = tickets.filter(t => t.priority === 'urgent').length;
  const waitingResponseCount = tickets.filter(t => t.status === 'waiting_response').length;
  const resolvedTicketsCount = tickets.filter(t => t.status === 'resolved').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <MessageSquare className="inline-block mr-3 h-8 w-8 text-blue-400" />
            Support Clients
          </h1>
          <p className="text-gray-400">Gérez les tickets de support et assistance client</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Tickets ouverts</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {openTicketsCount}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Urgents</p>
                  <p className="text-2xl font-bold text-red-400">
                    {urgentTicketsCount}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">En attente</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {waitingResponseCount}
                  </p>
                </div>
                <MessageCircle className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Résolus</p>
                  <p className="text-2xl font-bold text-green-400">
                    {resolvedTicketsCount}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
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
              
              <div className="w-full sm:w-48">
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="all" className="text-white hover:bg-slate-700">Toutes priorités</SelectItem>
                    <SelectItem value="urgent" className="text-white hover:bg-slate-700">Urgente</SelectItem>
                    <SelectItem value="high" className="text-white hover:bg-slate-700">Élevée</SelectItem>
                    <SelectItem value="normal" className="text-white hover:bg-slate-700">Normale</SelectItem>
                    <SelectItem value="low" className="text-white hover:bg-slate-700">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        {loading ? (
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-2" />
              <p className="text-gray-400">Chargement des tickets...</p>
            </CardContent>
          </Card>
        ) : filteredTickets.length === 0 ? (
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Aucun ticket trouvé</h3>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' ? 
                  'Aucun ticket ne correspond à vos critères de recherche.' :
                  'Aucun ticket de support pour le moment.'
                }
              </p>
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
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(ticket.category)}`}>
                          {getCategoryIcon(ticket.category)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {ticket.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`border ${getStatusColor(ticket.status)}`}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(ticket.status)}
                                <span>{getStatusLabel(ticket.status)}</span>
                              </div>
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {getPriorityLabel(ticket.priority)}
                            </Badge>
                            <Badge variant="outline" className="border-slate-600 text-gray-300">
                              {getCategoryLabel(ticket.category)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center text-gray-400">
                          <User className="h-4 w-4 mr-1" />
                          <span className="text-sm">{ticket.client_name || 'Client inconnu'}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        {ticket.messages && ticket.messages.length > 0 && (
                          <div className="flex items-center text-gray-400">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">{ticket.messages.length} message{ticket.messages.length > 1 ? 's' : ''}</span>
                          </div>
                        )}
                        {ticket.assigned_to && (
                          <div className="flex items-center text-gray-400">
                            <UserCheck className="h-4 w-4 mr-1" />
                            <span className="text-sm">Assigné à {ticket.assigned_to}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Dialog open={dialogOpen && selectedTicket?.id === ticket.id} onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (open) {
                          setSelectedTicket(ticket);
                        } else {
                          setSelectedTicket(null);
                          setReplyMessage('');
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                            <Reply className="h-4 w-4 mr-1" />
                            Répondre
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-white">
                              Ticket: {ticket.title}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            {/* Ticket Info */}
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(ticket.category)}`}>
                                    {getCategoryIcon(ticket.category)}
                                  </div>
                                  <div>
                                    <h4 className="text-white font-semibold">{ticket.title}</h4>
                                    <p className="text-gray-400 text-sm">Par {ticket.client_name}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Badge className={`border ${getStatusColor(ticket.status)}`}>
                                    {getStatusLabel(ticket.status)}
                                  </Badge>
                                  <Badge className={getPriorityColor(ticket.priority)}>
                                    {getPriorityLabel(ticket.priority)}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-gray-300 text-sm">{ticket.description}</p>
                            </div>
                            
                            {/* Messages History */}
                            {ticket.messages && ticket.messages.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="text-white font-medium">Historique des messages</h4>
                                <div className="max-h-64 overflow-y-auto space-y-3">
                                  {ticket.messages.map((message, index) => (
                                    <div key={index} className={`p-3 rounded-lg ${
                                      message.is_admin ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-slate-800/50'
                                    }`}>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className={`text-sm font-medium ${message.is_admin ? 'text-blue-300' : 'text-white'}`}>
                                          {message.is_admin ? '🛠️ Support' : '👤 Client'} - {message.user_name}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                          {new Date(message.timestamp).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                      <div 
                                        className={`text-sm ${message.is_admin ? 'text-blue-200' : 'text-gray-300'}`}
                                        dangerouslySetInnerHTML={{ __html: message.message }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Reply Form */}
                            <div className="space-y-3">
                              <h4 className="text-white font-medium">Votre réponse</h4>
                              <div className="bg-slate-800 border border-slate-600 rounded-md">
                                <RichTextEditor
                                  value={replyMessage}
                                  onChange={setReplyMessage}
                                  placeholder="Tapez votre réponse au client..."
                                  className="min-h-[120px]"
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setDialogOpen(false)}
                                  className="border-slate-600 text-gray-300"
                                >
                                  Annuler
                                </Button>
                                <Button 
                                  onClick={handleSendReply}
                                  disabled={sendingReply || !replyMessage.trim()}
                                  className="bg-gradient-to-r from-blue-500 to-cyan-500"
                                >
                                  {sendingReply ? (
                                    <>
                                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                      Envoi...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-4 w-4 mr-2" />
                                      Envoyer la réponse
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  {/* Last message preview */}
                  {ticket.messages && ticket.messages.length > 0 && (
                    <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">
                        Dernier message {ticket.messages[ticket.messages.length - 1].is_admin ? '(Support)' : '(Client)'}:
                      </div>
                      <div className="text-sm text-white line-clamp-2">
                        {ticket.messages[ticket.messages.length - 1].message}
                      </div>
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
    </AdminLayout>
  );
};

export default AdminTickets;