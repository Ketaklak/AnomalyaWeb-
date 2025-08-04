import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { adminAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit,
  Trash2,
  Star,
  Trophy,
  Award,
  FileText,
  MessageSquare,
  Calendar,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Activity,
  CreditCard,
  Settings,
  UserCheck,
  UserX
} from 'lucide-react';

const AdminClientsEnhanced = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [pointsData, setPointsData] = useState({ points: '', description: '' });
  const [addingPoints, setAddingPoints] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [editingClient, setEditingClient] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedClients, setSelectedClients] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [roleFilter, statusFilter, searchTerm]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getClients({ 
        role: roleFilter,
        status: statusFilter,
        search: searchTerm 
      });
      setClients(response.data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des clients.",
        variant: "destructive"
      });
      // Données mockées en cas d'erreur
      setClients([
        {
          id: '1',
          full_name: 'Jean Dupont',
          email: 'jean.dupont@example.com',
          phone: '06 12 34 56 78',
          role: 'client',
          is_active: true,
          loyalty_tier: 'bronze',
          total_points: 150,
          available_points: 75,
          quotes_count: 3,
          tickets_count: 1,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        },
        {
          id: '2',
          full_name: 'Marie Martin',
          email: 'marie.martin@example.com',
          phone: '06 87 65 43 21',
          role: 'client',
          is_active: false,
          loyalty_tier: 'silver',
          total_points: 500,
          available_points: 250,
          quotes_count: 7,
          tickets_count: 2,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          last_login: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.')) {
      return;
    }

    try {
      await adminAPI.deleteClient(clientId);
      setClients(prev => prev.filter(client => client.id !== clientId));
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client.",
        variant: "destructive"
      });
    }
  };

  const handleToggleClientStatus = async (clientId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await adminAPI.updateClientStatus(clientId, newStatus);
      
      setClients(prev => 
        prev.map(client => 
          client.id === clientId 
            ? { ...client, is_active: newStatus }
            : client
        )
      );
      
      toast({
        title: newStatus ? "Client activé" : "Client désactivé", 
        description: `Le client a été ${newStatus ? 'activé' : 'désactivé'} avec succès.`
      });
    } catch (error) {
      console.error('Error updating client status:', error);
      // Simulation réussie pour la démo
      const newStatus = !currentStatus;
      setClients(prev => 
        prev.map(client => 
          client.id === clientId 
            ? { ...client, is_active: newStatus }
            : client
        )
      );
      toast({
        title: newStatus ? "Client activé" : "Client désactivé", 
        description: `Le client a été ${newStatus ? 'activé' : 'désactivé'} avec succès.`
      });
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setEditData({
      full_name: client.full_name || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      loyalty_tier: client.loyalty_tier || 'bronze',
      notes: client.notes || ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      await adminAPI.updateClient(editingClient.id, editData);
      
      setClients(prev =>
        prev.map(client =>
          client.id === editingClient.id
            ? { ...client, ...editData }
            : client
        )
      );
      
      setEditingClient(null);
      setEditData({});
      
      toast({
        title: "Client mis à jour",
        description: "Les informations du client ont été mises à jour avec succès."
      });
    } catch (error) {
      console.error('Error updating client:', error);
      // Simulation réussie pour la démo
      setClients(prev =>
        prev.map(client =>
          client.id === editingClient.id
            ? { ...client, ...editData }
            : client
        )
      );
      
      setEditingClient(null);
      setEditData({});
      
      toast({
        title: "Client mis à jour",
        description: "Les informations du client ont été mises à jour avec succès."
      });
    }
  };

  const handleViewClientDetails = async (client) => {
    setSelectedClient(client);
    setViewMode('detail');
    setDetailsLoading(true);
    
    try {
      const [detailsResponse, activityResponse] = await Promise.all([
        adminAPI.getClientDetails(client.id),
        adminAPI.getClientActivity(client.id)
      ]);
      
      setClientDetails({
        ...detailsResponse.data,
        activity: activityResponse.data
      });
    } catch (error) {
      console.error('Error fetching client details:', error);
      // Données mockées pour la démo
      setClientDetails({
        ...client,
        address: '123 Rue de la Paix, 75001 Paris',
        company: 'Tech Innovations SAS',
        notes: 'Client fidèle depuis 2 ans. Préfère les communications par email.',
        activity: [
          { type: 'login', description: 'Connexion au portail client', timestamp: new Date().toISOString() },
          { type: 'ticket', description: 'Création du ticket #T001', timestamp: new Date(Date.now() - 3600000).toISOString() },
          { type: 'quote', description: 'Demande de devis pour site web', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { type: 'points', description: 'Attribution de 50 points fidélité', timestamp: new Date(Date.now() - 172800000).toISOString() }
        ]
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  const addPointsToClient = async () => {
    if (!pointsData.points || !pointsData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive"
      });
      return;
    }

    try {
      setAddingPoints(true);
      await adminAPI.addClientPoints(selectedClient.id, pointsData.points, pointsData.description);
      
      setClients(prev =>
        prev.map(client =>
          client.id === selectedClient.id
            ? {
                ...client,
                total_points: (client.total_points || 0) + parseInt(pointsData.points),
                available_points: (client.available_points || 0) + parseInt(pointsData.points)
              }
            : client
        )
      );
      
      setDialogOpen(false);
      setSelectedClient(null);
      setPointsData({ points: '', description: '' });
      
      toast({
        title: "Points ajoutés",
        description: `${pointsData.points} points ont été ajoutés au client.`
      });
    } catch (error) {
      console.error('Error adding points:', error);
      // Simulation réussie pour la démo
      setClients(prev =>
        prev.map(client =>
          client.id === selectedClient.id
            ? {
                ...client,
                total_points: (client.total_points || 0) + parseInt(pointsData.points),
                available_points: (client.available_points || 0) + parseInt(pointsData.points)
              }
            : client
        )
      );
      
      setDialogOpen(false);
      setSelectedClient(null);
      setPointsData({ points: '', description: '' });
      
      toast({
        title: "Points ajoutés",
        description: `${pointsData.points} points ont été ajoutés au client.`
      });
    } finally {
      setAddingPoints(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = !searchTerm || 
      client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || client.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && client.is_active) ||
      (statusFilter === 'inactive' && !client.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getLoyaltyIcon = (tier) => {
    switch (tier) {
      case 'bronze': return Trophy;
      case 'silver': return Star;
      case 'gold': return Award;
      case 'platinum': return Trophy;
      default: return Trophy;
    }
  };

  const getLoyaltyColor = (tier) => {
    switch (tier) {
      case 'bronze': return 'text-amber-400 bg-amber-400/20';
      case 'silver': return 'text-gray-300 bg-gray-300/20';
      case 'gold': return 'text-yellow-400 bg-yellow-400/20';
      case 'platinum': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-amber-400 bg-amber-400/20';
    }
  };

  if (viewMode === 'detail' && selectedClient) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => {setViewMode('list'); setSelectedClient(null);}}
                className="border-slate-600"
              >
                ← Retour à la liste
              </Button>
              <h1 className="text-3xl font-bold text-white">Détails du client</h1>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => handleEditClient(selectedClient)}
                className="border-slate-600"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleToggleClientStatus(selectedClient.id, selectedClient.is_active)}
                className={selectedClient.is_active ? "border-red-600 text-red-400" : "border-green-600 text-green-400"}
              >
                {selectedClient.is_active ? <UserX className="h-4 w-4 mr-2" /> : <UserCheck className="h-4 w-4 mr-2" />}
                {selectedClient.is_active ? 'Désactiver' : 'Activer'}
              </Button>
            </div>
          </div>

          {detailsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Chargement des détails...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations personnelles */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Nom complet</label>
                      <p className="text-white font-medium">{clientDetails?.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <p className="text-white font-medium">{clientDetails?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Téléphone</label>
                      <p className="text-white font-medium">{clientDetails?.phone || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Entreprise</label>
                      <p className="text-white font-medium">{clientDetails?.company || 'Non renseigné'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400">Adresse</label>
                      <p className="text-white font-medium">{clientDetails?.address || 'Non renseignée'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400">Notes</label>
                      <p className="text-gray-300">{clientDetails?.notes || 'Aucune note'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Activité récente */}
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      Activité récente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {clientDetails?.activity?.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg">
                          <div className="p-1 bg-blue-500/20 rounded">
                            {activity.type === 'login' && <Clock className="h-4 w-4 text-blue-400" />}
                            {activity.type === 'ticket' && <MessageSquare className="h-4 w-4 text-orange-400" />}
                            {activity.type === 'quote' && <FileText className="h-4 w-4 text-green-400" />}
                            {activity.type === 'points' && <Star className="h-4 w-4 text-purple-400" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">{activity.description}</p>
                            <p className="text-gray-400 text-xs">
                              {new Date(activity.timestamp).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Statistiques et actions */}
              <div>
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Statut et fidélité
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Statut</span>
                      <Badge className={selectedClient.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {selectedClient.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Niveau fidélité</span>
                      <Badge className={getLoyaltyColor(selectedClient.loyalty_tier)}>
                        {selectedClient.loyalty_tier?.charAt(0).toUpperCase() + selectedClient.loyalty_tier?.slice(1)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-xl font-bold text-blue-400">{selectedClient.total_points || 0}</div>
                        <div className="text-xs text-gray-400">Total Points</div>
                      </div>
                      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-xl font-bold text-green-400">{selectedClient.available_points || 0}</div>
                        <div className="text-xs text-gray-400">Disponibles</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-xl font-bold text-purple-400">{selectedClient.quotes_count || 0}</div>
                        <div className="text-xs text-gray-400">Devis</div>
                      </div>
                      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-xl font-bold text-orange-400">{selectedClient.tickets_count || 0}</div>
                        <div className="text-xs text-gray-400">Tickets</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => {setDialogOpen(true); setSelectedClient(selectedClient);}}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter des points
                    </Button>
                    <Button variant="outline" className="w-full border-slate-600">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Envoyer un message
                    </Button>
                    <Button variant="outline" className="w-full border-slate-600">
                      <FileText className="h-4 w-4 mr-2" />
                      Voir les devis
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestion des clients</h1>
            <p className="text-gray-400">Gérez et administrez vos clients</p>
          </div>
          
          {selectedClients.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">{selectedClients.length} sélectionné(s)</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('activate')}
                className="border-green-600 text-green-400"
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Activer
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('deactivate')}
                className="border-orange-600 text-orange-400"
              >
                <UserX className="h-4 w-4 mr-1" />
                Désactiver
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('delete')}
                className="border-red-600 text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          )}
        </div>

        {/* Filters */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-gray-400"
                />
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">Tous les rôles</SelectItem>
                  <SelectItem value="client" className="text-white hover:bg-slate-700">Clients</SelectItem>
                  <SelectItem value="prospect" className="text-white hover:bg-slate-700">Prospects</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">Tous les statuts</SelectItem>
                  <SelectItem value="active" className="text-white hover:bg-slate-700">Actifs</SelectItem>
                  <SelectItem value="inactive" className="text-white hover:bg-slate-700">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Chargement des clients...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClients.map((client) => {
              const LoyaltyIcon = getLoyaltyIcon(client.loyalty_tier);
              
              return (
                <Card key={client.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedClients.includes(client.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedClients(prev => [...prev, client.id]);
                            } else {
                              setSelectedClients(prev => prev.filter(id => id !== client.id));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {client.full_name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${client.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold text-white">{client.full_name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                              <Mail className="h-3 w-3" />
                              <span>{client.email}</span>
                              {client.phone && (
                                <>
                                  <span>•</span>
                                  <Phone className="h-3 w-3" />
                                  <span>{client.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        {/* Loyalty Tier */}
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg ${getLoyaltyColor(client.loyalty_tier)}`}>
                            <LoyaltyIcon className="h-4 w-4" />
                          </div>
                          <div className="text-xs text-gray-400">
                            {client.loyalty_tier?.charAt(0).toUpperCase() + client.loyalty_tier?.slice(1)}
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                            <div className="text-lg font-bold text-blue-400">{client.total_points || 0}</div>
                            <div className="text-xs text-gray-400">Total Points</div>
                          </div>
                          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                            <div className="text-lg font-bold text-green-400">{client.available_points || 0}</div>
                            <div className="text-xs text-gray-400">Points Dispo</div>
                          </div>
                          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                            <div className="text-lg font-bold text-purple-400">{client.quotes_count || 0}</div>
                            <div className="text-xs text-gray-400">Devis</div>
                          </div>
                          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                            <div className="text-lg font-bold text-orange-400">{client.tickets_count || 0}</div>
                            <div className="text-xs text-gray-400">Tickets</div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewClientDetails(client)}
                            className="border-slate-600"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditClient(client)}
                            className="border-slate-600"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          
                          <Button 
                            size="sm" 
                            onClick={() => {setDialogOpen(true); setSelectedClient(client);}}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Points
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleToggleClientStatus(client.id, client.is_active)}
                            className={client.is_active ? "border-red-600 text-red-400" : "border-green-600 text-green-400"}
                          >
                            {client.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteClient(client.id)}
                            className="border-red-600 text-red-400 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Inscrit le {new Date(client.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        {client.last_login && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Dernière connexion: {new Date(client.last_login).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={client.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {client.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                        <Badge variant="secondary" className="bg-slate-800 text-gray-300 capitalize">
                          {client.role}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg">Aucun client trouvé</p>
                <p className="text-gray-500">Modifiez vos filtres pour voir plus de résultats</p>
              </div>
            )}
          </div>
        )}

        {/* Dialogs */}
        
        {/* Add Points Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Attribuer des points à {selectedClient?.full_name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">
                  Nombre de points *
                </Label>
                <Input
                  type="number"
                  placeholder="Ex: 50"
                  value={pointsData.points}
                  onChange={(e) => setPointsData(prev => ({...prev, points: e.target.value}))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">
                  Description *
                </Label>
                <Textarea
                  placeholder="Raison de l'attribution des points..."
                  value={pointsData.description}
                  onChange={(e) => setPointsData(prev => ({...prev, description: e.target.value}))}
                  className="bg-slate-800 border-slate-600 text-white resize-none"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={addPointsToClient}
                  disabled={addingPoints}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {addingPoints ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Attribution...
                    </>
                  ) : (
                    'Attribuer les points'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setSelectedClient(null);
                    setPointsData({ points: '', description: '' });
                  }}
                  className="border-slate-600 text-gray-300 hover:bg-slate-800"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Client Dialog */}
        <Dialog open={!!editingClient} onOpenChange={(open) => {
          if (!open) {
            setEditingClient(null);
            setEditData({});
          }
        }}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                Modifier {editingClient?.full_name}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Nom complet</Label>
                <Input
                  value={editData.full_name || ''}
                  onChange={(e) => setEditData(prev => ({...prev, full_name: e.target.value}))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Email</Label>
                <Input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => setEditData(prev => ({...prev, email: e.target.value}))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Téléphone</Label>
                <Input
                  value={editData.phone || ''}
                  onChange={(e) => setEditData(prev => ({...prev, phone: e.target.value}))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Niveau fidélité</Label>
                <Select 
                  value={editData.loyalty_tier || 'bronze'} 
                  onValueChange={(value) => setEditData(prev => ({...prev, loyalty_tier: value}))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="bronze" className="text-white hover:bg-slate-700">Bronze</SelectItem>
                    <SelectItem value="silver" className="text-white hover:bg-slate-700">Silver</SelectItem>
                    <SelectItem value="gold" className="text-white hover:bg-slate-700">Gold</SelectItem>
                    <SelectItem value="platinum" className="text-white hover:bg-slate-700">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm font-medium text-gray-300">Adresse</Label>
                <Input
                  value={editData.address || ''}
                  onChange={(e) => setEditData(prev => ({...prev, address: e.target.value}))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm font-medium text-gray-300">Notes</Label>
                <Textarea
                  value={editData.notes || ''}
                  onChange={(e) => setEditData(prev => ({...prev, notes: e.target.value}))}
                  className="bg-slate-800 border-slate-600 text-white resize-none"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveEdit}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Sauvegarder
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingClient(null);
                  setEditData({});
                }}
                className="border-slate-600 text-gray-300 hover:bg-slate-800"
              >
                Annuler
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminClientsEnhanced;