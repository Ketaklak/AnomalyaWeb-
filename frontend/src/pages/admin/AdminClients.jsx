import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { adminAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Star,
  Trophy,
  Award,
  FileText,
  MessageSquare,
  Calendar,
  Loader2
} from 'lucide-react';

const AdminClients = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [pointsData, setPointsData] = useState({ points: '', description: '' });
  const [addingPoints, setAddingPoints] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getClients({ role: roleFilter });
        setClients(response.data || []);
      } catch (err) {
        console.error('Error fetching clients:', err);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des clients.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [roleFilter, toast]);

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'bronze': return Trophy;
      case 'silver': return Star;
      case 'gold': return Award;
      case 'platinum': return Trophy;
      default: return Trophy;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-600/20 text-amber-300 border-amber-500/30';
      case 'silver': return 'bg-gray-400/20 text-gray-300 border-gray-500/30';
      case 'gold': return 'bg-yellow-400/20 text-yellow-300 border-yellow-500/30';
      case 'platinum': return 'bg-purple-400/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-400/20 text-gray-300 border-gray-500/30';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'client_premium': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'client_standard': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'prospect': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'client_premium': return 'Premium';
      case 'client_standard': return 'Standard';
      case 'prospect': return 'Prospect';
      default: return 'Inconnu';
    }
  };

  const handleAddPoints = async () => {
    if (!selectedClient || !pointsData.points || !pointsData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive"
      });
      return;
    }

    setAddingPoints(true);
    try {
      const response = await adminAPI.addClientPoints(
        selectedClient.id, 
        parseInt(pointsData.points), 
        pointsData.description
      );

      if (response.data.success) {
        toast({
          title: "Points ajoutés !",
          description: `${pointsData.points} points ont été ajoutés à ${selectedClient.full_name}.`
        });

        // Refresh clients list
        const updatedResponse = await adminAPI.getClients({ role: roleFilter });
        setClients(updatedResponse.data || []);
        
        // Reset form and close dialog
        setPointsData({ points: '', description: '' });
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding points:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les points.",
        variant: "destructive"
      });
    } finally {
      setAddingPoints(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <Users className="inline-block mr-3 h-8 w-8 text-blue-400" />
            Gestion des Clients
          </h1>
          <p className="text-gray-400">Gérez vos clients et leur système de fidélité</p>
        </div>

        {/* Filters */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="w-full sm:w-48">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Type de client" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="all" className="text-white hover:bg-slate-700">Tous les clients</SelectItem>
                    <SelectItem value="client_premium" className="text-white hover:bg-slate-700">Premium</SelectItem>
                    <SelectItem value="client_standard" className="text-white hover:bg-slate-700">Standard</SelectItem>
                    <SelectItem value="prospect" className="text-white hover:bg-slate-700">Prospects</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        {loading ? (
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-2" />
              <p className="text-gray-400">Chargement des clients...</p>
            </CardContent>
          </Card>
        ) : filteredClients.length === 0 ? (
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Aucun client trouvé</h3>
              <p className="text-gray-400">
                {searchTerm || roleFilter !== 'all' ? 
                  'Aucun client ne correspond à vos critères de recherche.' :
                  'Aucun client enregistré pour le moment.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredClients.map((client) => {
              const TierIcon = getTierIcon(client.loyalty_tier);
              
              return (
                <Card key={client.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {client.full_name}
                            </h3>
                            <p className="text-gray-400 text-sm">@{client.username} • {client.email}</p>
                          </div>
                          
                          <Badge className={`border ${getRoleColor(client.role)}`}>
                            {getRoleLabel(client.role)}
                          </Badge>
                          
                          <Badge className={`border ${getTierColor(client.loyalty_tier)}`}>
                            <div className="flex items-center space-x-1">
                              <TierIcon className="h-3 w-3" />
                              <span className="capitalize">{client.loyalty_tier || 'bronze'}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                            <div className="text-xl font-bold text-blue-400">{client.total_points || 0}</div>
                            <div className="text-xs text-gray-400">Points Total</div>
                          </div>
                          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                            <div className="text-xl font-bold text-green-400">{client.available_points || 0}</div>
                            <div className="text-xs text-gray-400">Points Dispo</div>
                          </div>
                          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                            <div className="text-xl font-bold text-purple-400">{client.quotes_count || 0}</div>
                            <div className="text-xs text-gray-400">Devis</div>
                          </div>
                          <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                            <div className="text-xl font-bold text-orange-400">{client.tickets_count || 0}</div>
                            <div className="text-xs text-gray-400">Tickets</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Inscrit le {new Date(client.created_at).toLocaleDateString('fr-FR')}
                          </div>
                          {!client.is_active && (
                            <Badge variant="destructive" className="text-xs">Inactif</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Dialog open={dialogOpen && selectedClient?.id === client.id} onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (open) {
                            setSelectedClient(client);
                          } else {
                            setSelectedClient(null);
                            setPointsData({ points: '', description: '' });
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                              <Plus className="h-4 w-4 mr-1" />
                              Points
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border-slate-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">
                                Attribuer des points à {client.full_name}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                  Nombre de points *
                                </label>
                                <Input
                                  type="number"
                                  placeholder="Ex: 100"
                                  value={pointsData.points}
                                  onChange={(e) => setPointsData(prev => ({ ...prev, points: e.target.value }))}
                                  className="bg-slate-800 border-slate-600 text-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                  Description *
                                </label>
                                <Textarea
                                  placeholder="Ex: Points bonus pour fidélité"
                                  value={pointsData.description}
                                  onChange={(e) => setPointsData(prev => ({ ...prev, description: e.target.value }))}
                                  className="bg-slate-800 border-slate-600 text-white resize-none"
                                  rows={3}
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
                                  onClick={handleAddPoints}
                                  disabled={addingPoints || !pointsData.points || !pointsData.description}
                                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                                >
                                  {addingPoints ? (
                                    <>
                                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                      Attribution...
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="h-4 w-4 mr-2" />
                                      Attribuer
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm" className="border-slate-600 text-gray-300 hover:bg-slate-800">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminClients;