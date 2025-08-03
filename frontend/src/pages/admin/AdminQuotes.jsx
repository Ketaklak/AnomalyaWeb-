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
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Euro,
  User,
  Loader2,
  Globe,
  Smartphone,
  Brain,
  Shield,
  Users as UsersIcon,
  Wrench,
  GraduationCap
} from 'lucide-react';

const AdminQuotes = () => {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    estimated_price: '',
    estimated_duration: '',
    admin_notes: ''
  });

  const serviceIcons = {
    'Développement Web': Globe,
    'Application Mobile': Smartphone,
    'Intelligence Artificielle': Brain,
    'Cybersécurité': Shield,
    'Conseil IT': UsersIcon,
    'Maintenance': Wrench,
    'Formation': GraduationCap
  };

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getQuotes({ status: statusFilter });
        setQuotes(response.data || []);
      } catch (err) {
        console.error('Error fetching quotes:', err);
        toast({
          title: "Erreur",
          description: "Impossible de charger les demandes de devis.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [statusFilter, toast]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'in_review': return <AlertCircle className="h-4 w-4 text-blue-400" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'in_review': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'approved': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_review': return 'En révision';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'completed': return 'Terminé';
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

  const handleUpdateQuote = async () => {
    if (!selectedQuote || !updateData.status) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un statut.",
        variant: "destructive"
      });
      return;
    }

    setUpdating(true);
    try {
      const dataToUpdate = {};
      if (updateData.status) dataToUpdate.status = updateData.status;
      if (updateData.estimated_price) dataToUpdate.estimated_price = parseFloat(updateData.estimated_price);
      if (updateData.estimated_duration) dataToUpdate.estimated_duration = updateData.estimated_duration;
      if (updateData.admin_notes) dataToUpdate.admin_notes = updateData.admin_notes;

      const response = await adminAPI.updateQuote(selectedQuote.id, dataToUpdate);

      if (response.data.success) {
        toast({
          title: "Devis mis à jour !",
          description: "Les modifications ont été sauvegardées avec succès."
        });

        // Refresh quotes list
        const updatedResponse = await adminAPI.getQuotes({ status: statusFilter });
        setQuotes(updatedResponse.data || []);
        
        // Reset form and close dialog
        setUpdateData({ status: '', estimated_price: '', estimated_duration: '', admin_notes: '' });
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating quote:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le devis.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const filteredQuotes = quotes.filter(quote =>
    quote.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <FileText className="inline-block mr-3 h-8 w-8 text-blue-400" />
            Gestion des Devis
          </h1>
          <p className="text-gray-400">Gérez les demandes de devis des clients</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">En attente</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {quotes.filter(q => q.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">En révision</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {quotes.filter(q => q.status === 'in_review').length}
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
                  <p className="text-sm font-medium text-gray-400">Approuvés</p>
                  <p className="text-2xl font-bold text-green-400">
                    {quotes.filter(q => q.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Terminés</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {quotes.filter(q => q.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-400" />
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
                    placeholder="Rechercher un devis..."
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
                    <SelectItem value="pending" className="text-white hover:bg-slate-700">En attente</SelectItem>
                    <SelectItem value="in_review" className="text-white hover:bg-slate-700">En révision</SelectItem>
                    <SelectItem value="approved" className="text-white hover:bg-slate-700">Approuvé</SelectItem>
                    <SelectItem value="completed" className="text-white hover:bg-slate-700">Terminé</SelectItem>
                    <SelectItem value="rejected" className="text-white hover:bg-slate-700">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quotes List */}
        {loading ? (
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-2" />
              <p className="text-gray-400">Chargement des devis...</p>
            </CardContent>
          </Card>
        ) : filteredQuotes.length === 0 ? (
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Aucun devis trouvé</h3>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== 'all' ? 
                  'Aucun devis ne correspond à vos critères de recherche.' :
                  'Aucune demande de devis pour le moment.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredQuotes.map((quote) => {
              const ServiceIcon = serviceIcons[quote.service_category] || FileText;
              
              return (
                <Card key={quote.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            <ServiceIcon className="h-5 w-5 text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">
                              {quote.title}
                            </h3>
                          </div>
                          <Badge className={`border ${getStatusColor(quote.status)}`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(quote.status)}
                              <span>{getStatusLabel(quote.status)}</span>
                            </div>
                          </Badge>
                          <Badge className={getPriorityColor(quote.priority)}>
                            {getPriorityLabel(quote.priority)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center text-gray-400">
                            <User className="h-4 w-4 mr-1" />
                            <span className="text-sm">{quote.client_name || 'Client inconnu'}</span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="text-sm">
                              {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          {quote.budget_range && (
                            <div className="flex items-center text-gray-400">
                              <Euro className="h-4 w-4 mr-1" />
                              <span className="text-sm">{quote.budget_range}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {quote.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="px-2 py-1 bg-slate-700 rounded text-xs">
                            {quote.service_category}
                          </div>
                          {quote.deadline && (
                            <div>
                              Échéance: {new Date(quote.deadline).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {quote.estimated_price && (
                          <div className="text-right mr-2">
                            <div className="text-sm text-gray-400">Devis estimé</div>
                            <div className="text-lg font-bold text-green-400">
                              {quote.estimated_price.toLocaleString('fr-FR')} €
                            </div>
                          </div>
                        )}
                        
                        <Dialog open={dialogOpen && selectedQuote?.id === quote.id} onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (open) {
                            setSelectedQuote(quote);
                            setUpdateData({
                              status: quote.status || '',
                              estimated_price: quote.estimated_price || '',
                              estimated_duration: quote.estimated_duration || '',
                              admin_notes: quote.admin_notes || ''
                            });
                          } else {
                            setSelectedQuote(null);
                            setUpdateData({ status: '', estimated_price: '', estimated_duration: '', admin_notes: '' });
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                              <Edit className="h-4 w-4 mr-1" />
                              Traiter
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-white">
                                Traiter le devis: {quote.title}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-300">
                                    Statut *
                                  </label>
                                  <Select value={updateData.status} onValueChange={(value) => setUpdateData(prev => ({ ...prev, status: value }))}>
                                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                                      <SelectValue placeholder="Sélectionner un statut" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-600">
                                      <SelectItem value="pending" className="text-white hover:bg-slate-700">En attente</SelectItem>
                                      <SelectItem value="in_review" className="text-white hover:bg-slate-700">En révision</SelectItem>
                                      <SelectItem value="approved" className="text-white hover:bg-slate-700">Approuvé</SelectItem>
                                      <SelectItem value="rejected" className="text-white hover:bg-slate-700">Rejeté</SelectItem>
                                      <SelectItem value="completed" className="text-white hover:bg-slate-700">Terminé</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-300">
                                    Prix estimé (€)
                                  </label>
                                  <Input
                                    type="number"
                                    placeholder="Ex: 5000"
                                    value={updateData.estimated_price}
                                    onChange={(e) => setUpdateData(prev => ({ ...prev, estimated_price: e.target.value }))}
                                    className="bg-slate-800 border-slate-600 text-white"
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                  Durée estimée
                                </label>
                                <Input
                                  placeholder="Ex: 2-3 semaines"
                                  value={updateData.estimated_duration}
                                  onChange={(e) => setUpdateData(prev => ({ ...prev, estimated_duration: e.target.value }))}
                                  className="bg-slate-800 border-slate-600 text-white"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                  Notes internes
                                </label>
                                <Textarea
                                  placeholder="Commentaires pour le client..."
                                  value={updateData.admin_notes}
                                  onChange={(e) => setUpdateData(prev => ({ ...prev, admin_notes: e.target.value }))}
                                  className="bg-slate-800 border-slate-600 text-white resize-none"
                                  rows={3}
                                />
                              </div>
                              
                              <div className="flex justify-end space-x-2 pt-4">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setDialogOpen(false)}
                                  className="border-slate-600 text-gray-300"
                                >
                                  Annuler
                                </Button>
                                <Button 
                                  onClick={handleUpdateQuote}
                                  disabled={updating || !updateData.status}
                                  className="bg-gradient-to-r from-blue-500 to-cyan-500"
                                >
                                  {updating ? (
                                    <>
                                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                      Mise à jour...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mettre à jour
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    {quote.admin_notes && (
                      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="text-sm text-blue-300 font-medium mb-1">Notes de l'équipe :</div>
                        <div className="text-sm text-blue-200">{quote.admin_notes}</div>
                      </div>
                    )}
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

export default AdminQuotes;