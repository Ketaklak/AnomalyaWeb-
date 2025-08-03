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
import { analyticsAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

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
      
      // Fetch real data from analytics APIs
      const [
        overviewResponse,
        userActivityResponse,
        contentPerformanceResponse,
        trafficSourcesResponse,
        popularPagesResponse
      ] = await Promise.all([
        analyticsAPI.getOverview(timeRange),
        analyticsAPI.getUserActivity(timeRange),
        analyticsAPI.getContentPerformance(10),
        analyticsAPI.getTrafficSources(timeRange),
        analyticsAPI.getPopularPages(5)
      ]);

      setAnalytics({
        overview: overviewResponse.data.data.overview,
        userActivity: userActivityResponse.data.data.userActivity,
        contentPerformance: contentPerformanceResponse.data.data.contentPerformance,
        trafficSources: trafficSourcesResponse.data.data.trafficSources,
        popularPages: popularPagesResponse.data.data.popularPages
      });
      
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
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Chargement des analytics...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
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
    </AdminLayout>
  );
};

export default AnalyticsDashboard;