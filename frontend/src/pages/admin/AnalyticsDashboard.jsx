import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  MessageSquare, 
  Star,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  Download,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import api from '../../services/api';

const AnalyticsDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      totalArticles: 0,
      totalContacts: 0,
      totalQuotes: 0,
      growth: {
        users: 0,
        articles: 0,
        contacts: 0,
        quotes: 0
      }
    },
    userActivity: [],
    contentPerformance: [],
    trafficSources: [],
    popularPages: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Simulating API call - replace with actual endpoint
      const mockData = {
        overview: {
          totalUsers: 247,
          totalArticles: 45,
          totalContacts: 89,
          totalQuotes: 156,
          growth: {
            users: 12.5,
            articles: 8.3,
            contacts: -5.2,
            quotes: 15.7
          }
        },
        userActivity: [
          { date: '2025-01-01', users: 45, sessions: 67 },
          { date: '2025-01-02', users: 52, sessions: 78 },
          { date: '2025-01-03', users: 38, sessions: 45 },
          { date: '2025-01-04', users: 63, sessions: 89 },
          { date: '2025-01-05', users: 71, sessions: 95 },
          { date: '2025-01-06', users: 58, sessions: 73 },
          { date: '2025-01-07', users: 69, sessions: 87 }
        ],
        contentPerformance: [
          { title: 'Les tendances IA en 2025', views: 1234, engagement: 85 },
          { title: 'Cybersécurité entreprise', views: 987, engagement: 78 },
          { title: 'Développement web moderne', views: 756, engagement: 92 },
          { title: 'Guide maintenance PC', views: 654, engagement: 67 },
        ],
        trafficSources: [
          { source: 'Direct', visitors: 45.2, color: '#3b82f6' },
          { source: 'Google', visitors: 32.1, color: '#10b981' },
          { source: 'Social Media', visitors: 15.7, color: '#f59e0b' },
          { source: 'Referral', visitors: 7.0, color: '#8b5cf6' }
        ],
        popularPages: [
          { page: '/services', views: 2847, bounce: 23.4 },
          { page: '/actualites', views: 2156, bounce: 18.7 },
          { page: '/contact', views: 1834, bounce: 34.2 },
          { page: '/competences', views: 1523, bounce: 28.9 }
        ]
      };
      
      setAnalytics(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <div className="flex items-center mt-1">
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {change}%
              </span>
            </div>
          </div>
          <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProgressBar = ({ percentage, color = 'bg-blue-500' }) => (
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${color} transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
          <span className="ml-2 text-gray-400">Chargement des analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400">Suivez les performances de votre site</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="7d" className="text-white">7 jours</SelectItem>
              <SelectItem value="30d" className="text-white">30 jours</SelectItem>
              <SelectItem value="90d" className="text-white">90 jours</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchAnalytics} className="border-slate-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" className="border-slate-600">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs"
          value={analytics.overview.totalUsers}
          change={analytics.overview.growth.users}
          icon={Users}
          trend={analytics.overview.growth.users > 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Articles"
          value={analytics.overview.totalArticles}
          change={analytics.overview.growth.articles}
          icon={FileText}
          trend={analytics.overview.growth.articles > 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Messages"
          value={analytics.overview.totalContacts}
          change={analytics.overview.growth.contacts}
          icon={MessageSquare}
          trend={analytics.overview.growth.contacts > 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Devis"
          value={analytics.overview.totalQuotes}
          change={analytics.overview.growth.quotes}
          icon={Star}
          trend={analytics.overview.growth.quotes > 0 ? 'up' : 'down'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-400" />
              Activité Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.userActivity.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {new Date(day.date).toLocaleDateString('fr-FR', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <div className="flex items-center gap-4 flex-1 mx-4">
                    <ProgressBar percentage={(day.users / 100) * 100} color="bg-blue-500" />
                    <span className="text-white text-sm w-8">{day.users}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-blue-400" />
              Sources de Trafic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: source.color }}
                    ></div>
                    <span className="text-gray-400">{source.source}</span>
                  </div>
                  <span className="text-white font-semibold">{source.visitors}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Performance */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              Performance du Contenu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.contentPerformance.map((content, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm truncate">{content.title}</span>
                    <span className="text-gray-400 text-sm">{content.views} vues</span>
                  </div>
                  <ProgressBar percentage={content.engagement} color="bg-green-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Pages */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-400" />
              Pages Populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.popularPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <div className="text-white text-sm">{page.page}</div>
                    <div className="text-gray-400 text-xs">{page.views} vues</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${page.bounce < 30 ? 'text-green-500' : 'text-yellow-500'}`}>
                      {page.bounce}% bounce
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;