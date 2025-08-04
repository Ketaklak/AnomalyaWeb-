import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { clientAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { 
  MessageSquare,
  ArrowLeft,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Calendar,
  Settings,
  CreditCard,
  HelpCircle,
  Lightbulb,
  Loader2,
  User,
  UserCheck
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const TicketDetail = () => {
  const { ticketId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        // Note: We'll need to implement a specific endpoint for single ticket
        // For now, we'll get all tickets and find the specific one
        const response = await clientAPI.getTickets({});
        const tickets = response.data || [];
        const foundTicket = tickets.find(t => t.id === ticketId);
        
        if (foundTicket) {
          setTicket(foundTicket);
        } else {
          setError('Ticket non trouvé');
        }
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError('Erreur lors du chargement du ticket');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'technical': return <Settings className="h-5 w-5 text-blue-400" />;
      case 'billing': return <CreditCard className="h-5 w-5 text-green-400" />;
      case 'general': return <HelpCircle className="h-5 w-5 text-purple-400" />;
      case 'feature_request': return <Lightbulb className="h-5 w-5 text-orange-400" />;
      default: return <MessageSquare className="h-5 w-5 text-gray-400" />;
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
      case 'waiting_response': return 'En attente de votre réponse';
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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un message.",
        variant: "destructive"
      });
      return;
    }

    setSendingMessage(true);
    try {
      const response = await clientAPI.addTicketMessage(ticketId, newMessage);

      if (response.data.success) {
        toast({
          title: "Message envoyé !",
          description: "Votre message a été ajouté au ticket."
        });

        // Refresh ticket data
        const ticketsResponse = await clientAPI.getTickets({});
        const tickets = ticketsResponse.data || [];
        const updatedTicket = tickets.find(t => t.id === ticketId);
        
        if (updatedTicket) {
          setTicket(updatedTicket);
        }
        
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message.",
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
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
              <span className="ml-2 text-gray-400">Chargement du ticket...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Ticket non trouvé</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <Button asChild variant="outline" className="border-slate-600 text-gray-300">
                <Link to="/client/tickets">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour aux tickets
                </Link>
              </Button>
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
            <Button asChild variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-800 mb-4">
              <Link to="/client/tickets">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux tickets
              </Link>
            </Button>
            
            {user?.role === 'admin' && (
              <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-300 text-sm">Mode Administrateur - Vue détaillée du ticket client</span>
                </div>
              </div>
            )}
          </div>

          {/* Ticket Header */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${getCategoryColor(ticket.category)}`}>
                    {getCategoryIcon(ticket.category)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{ticket.title}</h1>
                    <div className="flex items-center space-x-3">
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
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400">Créé le</div>
                  <div className="text-white font-medium">
                    {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Dernière mise à jour</div>
                  <div className="text-white font-medium">
                    {new Date(ticket.updated_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Messages</div>
                  <div className="text-white font-medium">
                    {ticket.messages ? ticket.messages.length : 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Assigné à</div>
                  <div className="text-white font-medium">
                    {ticket.assigned_to || 'Non assigné'}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">Description initiale :</div>
                <div className="text-white">{ticket.description}</div>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-blue-400" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ticket.messages && ticket.messages.length > 0 ? (
                <div className="space-y-4">
                  {ticket.messages.map((message, index) => (
                    <div key={index} className={`p-4 rounded-lg ${
                      message.is_admin 
                        ? 'bg-blue-500/10 border border-blue-500/20 ml-4' 
                        : 'bg-slate-800/50 mr-4'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {message.is_admin ? (
                            <div className="flex items-center space-x-2">
                              <UserCheck className="h-4 w-4 text-blue-400" />
                              <span className="text-blue-300 font-medium">🛠️ Support - {message.user_name}</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-white" />
                              <span className="text-white font-medium">👤 Vous</span>
                            </div>
                          )}
                        </div>
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
                        className={`${message.is_admin ? 'text-blue-200' : 'text-gray-300'}`}
                        dangerouslySetInnerHTML={{ __html: message.message }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>Aucun message dans cette conversation</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reply Form */}
          {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Ajouter un message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white resize-none"
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !newMessage.trim()}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      {sendingMessage ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(ticket.status === 'closed' || ticket.status === 'resolved') && (
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-green-300 font-medium mb-1">
                  Ticket {ticket.status === 'resolved' ? 'résolu' : 'fermé'}
                </h3>
                <p className="text-green-200 text-sm">
                  Ce ticket a été {ticket.status === 'resolved' ? 'résolu' : 'fermé'}. 
                  Si vous avez encore des questions, n'hésitez pas à créer un nouveau ticket.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TicketDetail;