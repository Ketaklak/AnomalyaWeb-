import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { clientAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Trophy, 
  Star, 
  FileText, 
  MessageSquare, 
  Settings,
  TrendingUp,
  Clock,
  Loader2,
  Plus,
  Eye,
  Award
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ClientDashboard = () => {
  const { user, loyaltyTier, totalPoints, availablePoints } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await clientAPI.getDashboard();
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError('Erreur lors du chargement du tableau de bord');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getTierColor = (tier) => {
    switch (tier) {
      case 'bronze': return 'from-amber-600 to-amber-800';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'bronze': return Trophy;
      case 'silver': return Star;
      case 'gold': return Award;
      case 'platinum': return Trophy;
      default: return Trophy;
    }
  };

  const getNextTierName = (currentTier) => {
    switch (currentTier) {
      case 'bronze': return 'Silver';
      case 'silver': return 'Gold';
      case 'gold': return 'Platinum';
      case 'platinum': return null;
      default: return 'Silver';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Chargement du tableau de bord...</span>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center text-red-400">
              <p>{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const TierIcon = getTierIcon(loyaltyTier);
  const nextTierName = getNextTierName(loyaltyTier);
  const progressToNextTier = nextTierName ? 
    Math.min(100, (totalPoints / (dashboardData?.next_tier_points + totalPoints)) * 100) : 100;

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bonjour {user?.full_name} ! 👋
            </h1>
            <p className="text-gray-400">
              {user?.role === 'admin' ? 
                'Interface client - Mode administrateur (pour test et supervision)' : 
                'Bienvenue dans votre espace client Anomalya Corp'
              }
            </p>
            
            {/* Admin Notice */}
            {user?.role === 'admin' && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-300 text-sm font-medium">Mode Administrateur</span>
                </div>
                <p className="text-blue-200 text-sm mt-2">
                  Vous accédez à l'interface client en tant qu'administrateur. 
                  Cette vue vous permet de tester et comprendre l'expérience client.
                </p>
              </div>
            )}
          </div>

          {/* Loyalty Status Card */}
          <Card className="mb-8 bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 bg-gradient-to-r ${getTierColor(loyaltyTier)} rounded-lg`}>
                    <TierIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white capitalize">
                      Statut {loyaltyTier}
                    </h3>
                    <p className="text-gray-400">Niveau de fidélité actuel</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {availablePoints} pts
                  </div>
                  <div className="text-sm text-gray-400">
                    {totalPoints} pts au total
                  </div>
                </div>
              </div>
              
              {nextTierName && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progression vers {nextTierName}</span>
                    <span className="text-gray-400">
                      {dashboardData?.next_tier_points} pts restants
                    </span>
                  </div>
                  <Progress value={progressToNextTier} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-400 mb-1">
                      Devis actifs
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {dashboardData?.active_quotes || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-400 mb-1">
                      Projets terminés
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {dashboardData?.completed_projects || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-400 mb-1">
                      Tickets ouverts
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {dashboardData?.open_tickets || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
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
                      Points fidélité
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {totalPoints}
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Points Transactions */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-400" />
                  Historique des points récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recent_transactions?.length > 0 ? (
                    dashboardData.recent_transactions.map((transaction, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-gray-400">
                            {transaction.transaction_type} • 
                            {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <div className={`text-sm font-bold ${
                          transaction.points > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-center py-4">
                      Aucune transaction récente
                    </div>
                  )}
                  
                  <Button asChild variant="outline" className="w-full border-slate-600 text-gray-300 hover:bg-slate-800">
                    <Link to="/client/points">
                      Voir tout l'historique
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-blue-400" />
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <Link to="/client/quotes/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Demander un devis
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full border-slate-600 text-gray-300 hover:bg-slate-800">
                    <Link to="/client/tickets/new">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Créer un ticket
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full border-slate-600 text-gray-300 hover:bg-slate-800">
                    <Link to="/client/quotes">
                      <Eye className="mr-2 h-4 w-4" />
                      Voir mes devis
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full border-slate-600 text-gray-300 hover:bg-slate-800">
                    <Link to="/client/profile">
                      <Settings className="mr-2 h-4 w-4" />
                      Mon profil
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loyalty Benefits */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                Avantages du statut {loyaltyTier}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loyaltyTier === 'bronze' && (
                  <>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-blue-400 font-semibold">5%</div>
                      <div className="text-sm text-gray-400">Remise sur services</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-blue-400 font-semibold">Support</div>
                      <div className="text-sm text-gray-400">Email uniquement</div>
                    </div>
                  </>
                )}
                {loyaltyTier === 'silver' && (
                  <>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-blue-400 font-semibold">10%</div>
                      <div className="text-sm text-gray-400">Remise sur services</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-blue-400 font-semibold">Support</div>
                      <div className="text-sm text-gray-400">Email + Chat</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-blue-400 font-semibold">Priorité</div>
                      <div className="text-sm text-gray-400">Devis prioritaires</div>
                    </div>
                  </>
                )}
                {loyaltyTier === 'gold' && (
                  <>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-blue-400 font-semibold">15%</div>
                      <div className="text-sm text-gray-400">Remise sur services</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-blue-400 font-semibold">Support</div>
                      <div className="text-sm text-gray-400">Téléphone inclus</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-blue-400 font-semibold">Consultation</div>
                      <div className="text-sm text-gray-400">1h gratuite/mois</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-blue-400 font-semibold">Accès</div>
                      <div className="text-sm text-gray-400">Beta features</div>
                    </div>
                  </>
                )}
                {loyaltyTier === 'platinum' && (
                  <>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-blue-400 font-semibold">20%</div>
                      <div className="text-sm text-gray-400">Remise sur services</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-blue-400 font-semibold">Support</div>
                      <div className="text-sm text-gray-400">Dédié 24/7</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-blue-400 font-semibold">Consultation</div>
                      <div className="text-sm text-gray-400">3h gratuites/mois</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                      <div className="text-blue-400 font-semibold">Manager</div>
                      <div className="text-sm text-gray-400">Compte dédié</div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientDashboard;