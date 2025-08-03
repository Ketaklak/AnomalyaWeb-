import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { authAPI } from '../../services/api';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield,
  Mail,
  Calendar,
  Loader2
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsersAndStats();
  }, []);

  const fetchUsersAndStats = async () => {
    try {
      setLoading(true);
      const [usersResponse, statsResponse] = await Promise.all([
        authAPI.getUsers({ limit: 100 }),
        authAPI.getStats()
      ]);
      
      setUsers(usersResponse.data || []);
      setStats(statsResponse.data || {});
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'moderator': return 'bg-orange-500';
      case 'client': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'moderator': return 'Modérateur';
      case 'client': return 'Client';
      default: return role;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gestion des utilisateurs</h1>
          <p className="text-gray-400">Gérez les comptes utilisateurs de votre plateforme</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-400 mb-1">
                      Total utilisateurs
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {stats.total_users || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-400 mb-1">
                      Utilisateurs actifs
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {stats.active_users || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-400 mb-1">
                      Administrateurs
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {stats.by_role?.admin || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-400 mb-1">
                      Clients
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {stats.by_role?.client || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Chargement des utilisateurs...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p>{error}</p>
          </div>
        ) : (
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Liste des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-gray-400 font-medium py-3">Utilisateur</th>
                      <th className="text-left text-gray-400 font-medium py-3">Email</th>
                      <th className="text-left text-gray-400 font-medium py-3">Rôle</th>
                      <th className="text-left text-gray-400 font-medium py-3">Statut</th>
                      <th className="text-left text-gray-400 font-medium py-3">Inscription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {user.full_name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-medium">{user.full_name}</div>
                              <div className="text-gray-400 text-sm">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center text-gray-300">
                            <Mail className="h-4 w-4 mr-2" />
                            {user.email}
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                            {getRoleLabel(user.role)}
                          </Badge>
                        </td>
                        <td className="py-4">
                          {user.is_active ? (
                            <div className="flex items-center text-green-400">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Actif
                            </div>
                          ) : (
                            <div className="flex items-center text-red-400">
                              <UserX className="h-4 w-4 mr-2" />
                              Inactif
                            </div>
                          )}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(user.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {users.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Aucun utilisateur trouvé.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;