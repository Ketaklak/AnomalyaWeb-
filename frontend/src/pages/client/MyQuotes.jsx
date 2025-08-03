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
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Euro
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const MyQuotes = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const response = await clientAPI.getQuotes({ status: statusFilter });
        setQuotes(response.data || []);
      } catch (err) {
        console.error('Error fetching quotes:', err);
        setError('Erreur lors du chargement des devis');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [statusFilter]);

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

  const filteredQuotes = quotes.filter(quote =>
    quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Chargement des devis...</span>
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
                Mes <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Devis</span>
              </h1>
              <p className="text-gray-400">Gérez et suivez vos demandes de devis</p>
              
              {user?.role === 'admin' && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-300 text-sm">Mode Administrateur - Vue des devis clients</span>
                  </div>
                </div>
              )}
            </div>
            
            <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <Link to="/client/quotes/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau devis
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
          {error ? (
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-8 text-center">
                <div className="text-red-400 mb-2">
                  <XCircle className="h-8 w-8 mx-auto mb-2" />
                  {error}
                </div>
              </CardContent>
            </Card>
          ) : filteredQuotes.length === 0 ? (
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Aucun devis trouvé</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm || statusFilter !== 'all' ? 
                    'Aucun devis ne correspond à vos critères de recherche.' :
                    'Vous n\'avez pas encore créé de devis.'
                  }
                </p>
                <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <Link to="/client/quotes/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer mon premier devis
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredQuotes.map((quote) => (
                <Card key={quote.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {quote.title}
                          </h3>
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
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {quote.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Créé le {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                          </div>
                          {quote.budget_range && (
                            <div className="flex items-center">
                              <Euro className="h-3 w-3 mr-1" />
                              {quote.budget_range}
                            </div>
                          )}
                          {quote.service_category && (
                            <div className="px-2 py-1 bg-slate-700 rounded text-xs">
                              {quote.service_category}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {quote.estimated_price && (
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Devis estimé</div>
                            <div className="text-lg font-bold text-green-400">
                              {quote.estimated_price.toLocaleString('fr-FR')} €
                            </div>
                          </div>
                        )}
                        <Button asChild variant="outline" size="sm" className="border-slate-600 text-gray-300 hover:bg-slate-800">
                          <Link to={`/client/quotes/${quote.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {quote.admin_notes && (
                      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="text-sm text-blue-300 font-medium mb-1">Note de l'équipe :</div>
                        <div className="text-sm text-blue-200">{quote.admin_notes}</div>
                      </div>
                    )}
                    
                    {quote.estimated_duration && (
                      <div className="mt-3">
                        <span className="text-sm text-gray-400">Durée estimée : </span>
                        <span className="text-sm text-white">{quote.estimated_duration}</span>
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

export default MyQuotes;