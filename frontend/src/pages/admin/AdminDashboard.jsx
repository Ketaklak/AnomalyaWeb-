import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { adminAPI } from '../../services/api';
import { 
  FileText, 
  MessageSquare, 
  Users, 
  Settings,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getDashboardStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Chargement du tableau de bord...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center text-red-400">
            <p>{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Articles',
      value: stats?.totals?.articles || 0,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      href: '/admin/articles'
    },
    {
      title: 'Messages',
      value: stats?.totals?.contacts || 0,
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500',
      href: '/admin/contacts'
    },
    {
      title: 'Utilisateurs',
      value: stats?.totals?.users || 0,
      icon: Users,
      color: 'from-orange-500 to-red-500',
      href: '/admin/users'
    },
    {
      title: 'Services',
      value: stats?.totals?.services || 0,
      icon: Settings,
      color: 'from-purple-500 to-pink-500',
      href: '/admin/services'
    }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
          <p className="text-gray-400">Vue d'ensemble de votre site Anomalya Corp</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-400 mb-1">
                        {stat.title}
                      </div>
                      <div className="text-3xl font-bold text-white">
                        {stat.value}
                      </div>
                    </div>
                    <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Contacts */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-green-400" />
                Messages récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recent_contacts?.length > 0 ? (
                  stats.recent_contacts.map((contact, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">
                          {contact.nom}
                        </div>
                        <div className="text-xs text-gray-400">
                          {contact.email}
                        </div>
                        <div className="text-sm text-gray-300 mt-1">
                          {contact.sujet}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-4">
                    Aucun message récent
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Articles */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-400" />
                Articles récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recent_articles?.length > 0 ? (
                  stats.recent_articles.map((article, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">
                          {article.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {article.category} • Par {article.author}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(article.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-4">
                    Aucun article récent
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-purple-400" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href="/admin/articles"
                  className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <FileText className="h-8 w-8 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">Nouvel article</div>
                    <div className="text-gray-400 text-sm">Créer un article</div>
                  </div>
                </a>

                <a 
                  href="/admin/contacts"
                  className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <MessageSquare className="h-8 w-8 text-green-400" />
                  <div>
                    <div className="text-white font-medium">Voir messages</div>
                    <div className="text-gray-400 text-sm">Gérer les contacts</div>
                  </div>
                </a>

                <a 
                  href="/admin/users"
                  className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Users className="h-8 w-8 text-orange-400" />
                  <div>
                    <div className="text-white font-medium">Utilisateurs</div>
                    <div className="text-gray-400 text-sm">Gérer les comptes</div>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;