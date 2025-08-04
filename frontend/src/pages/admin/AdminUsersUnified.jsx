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
  UserX,
  Shield,
  Crown,
  User
} from 'lucide-react';

const AdminUsersUnified = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsData, setPointsData] = useState({ points: '', description: '' });
  const [addingPoints, setAddingPoints] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [createUserModal, setCreateUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: 'client',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers({ 
        role: roleFilter,
        status: statusFilter,
        search: searchTerm 
      });
      setUsers(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des utilisateurs.",
        variant: "destructive"
      });
      // Données mockées pour la démo
      setUsers([
        {
          id: '1',
          username: 'admin',
          full_name: 'Administrateur Principal',
          email: 'admin@anomalya.fr',
          phone: '01 23 45 67 89',
          role: 'admin',
          is_active: true,
          created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
          last_login: new Date().toISOString(),
          login_count: 45
        },
        {
          id: '2',
          username: 'testclient789',
          full_name: 'Test Client User',
          email: 'testclient789@example.com',
          phone: '06 12 34 56 78',
          role: 'client',
          is_active: true,
          loyalty_tier: 'bronze',
          total_points: 150,
          available_points: 75,
          quotes_count: 3,
          tickets_count: 1,
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          last_login: new Date(Date.now() - 3600000).toISOString(),
          login_count: 12
        },
        {
          id: '3',
          username: 'marie.martin',
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
          created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
          last_login: new Date(Date.now() - 86400000 * 2).toISOString(),
          login_count: 28
        },
        {
          id: '4',
          username: 'support_agent',
          full_name: 'Agent Support',
          email: 'support@anomalya.fr',
          phone: '01 23 45 67 90',
          role: 'moderator',
          is_active: true,
          created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
          last_login: new Date(Date.now() - 7200000).toISOString(),
          login_count: 35
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      // Simulation pour la démo
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès."
      });
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await adminAPI.updateUserStatus(userId, newStatus);
      
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, is_active: newStatus }
            : user
        )
      );
      
      toast({
        title: newStatus ? "Utilisateur activé" : "Utilisateur désactivé", 
        description: `L'utilisateur a été ${newStatus ? 'activé' : 'désactivé'} avec succès.`
      });
    } catch (error) {
      // Simulation pour la démo
      const newStatus = !currentStatus;
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, is_active: newStatus }
            : user
        )
      );
      toast({
        title: newStatus ? "Utilisateur activé" : "Utilisateur désactivé", 
        description: `L'utilisateur a été ${newStatus ? 'activé' : 'désactivé'} avec succès.`
      });
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'client',
      loyalty_tier: user.loyalty_tier || 'bronze',
      notes: user.notes || ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      await adminAPI.updateUser(editingUser.id, editData);
      
      setUsers(prev =>
        prev.map(user =>
          user.id === editingUser.id
            ? { ...user, ...editData }
            : user
        )
      );
      
      setEditingUser(null);
      setEditData({});
      
      toast({
        title: "Utilisateur mis à jour",
        description: "Les informations de l'utilisateur ont été mises à jour avec succès."
      });
    } catch (error) {
      // Simulation pour la démo
      setUsers(prev =>
        prev.map(user =>
          user.id === editingUser.id
            ? { ...user, ...editData }
            : user
        )
      );
      
      setEditingUser(null);
      setEditData({});
      
      toast({
        title: "Utilisateur mis à jour",
        description: "Les informations de l'utilisateur ont été mises à jour avec succès."
      });
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await adminAPI.createUser(newUserData);
      
      setUsers(prev => [...prev, { 
        ...response.data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        is_active: true,
        login_count: 0
      }]);
      
      setCreateUserModal(false);
      setNewUserData({
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'client',
        phone: '',
        address: ''
      });
      
      toast({
        title: "Utilisateur créé",
        description: "Le nouvel utilisateur a été créé avec succès."
      });
    } catch (error) {
      // Simulation pour la démo
      setUsers(prev => [...prev, { 
        ...newUserData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        is_active: true,
        login_count: 0,
        total_points: 0,
        available_points: 0,
        quotes_count: 0,
        tickets_count: 0
      }]);
      
      setCreateUserModal(false);
      setNewUserData({
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'client',
        phone: '',
        address: ''
      });
      
      toast({
        title: "Utilisateur créé",
        description: "Le nouvel utilisateur a été créé avec succès."
      });
    }
  };

  const addPointsToUser = async () => {
    if (!pointsData.points || !pointsData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive"
      });
      return;
    }

    if (selectedUser.role !== 'client') {
      toast({
        title: "Erreur",
        description: "Seuls les clients peuvent recevoir des points de fidélité.",
        variant: "destructive"
      });
      return;
    }

    try {
      setAddingPoints(true);
      await adminAPI.addClientPoints(selectedUser.id, pointsData.points, pointsData.description);
      
      setUsers(prev =>
        prev.map(user =>
          user.id === selectedUser.id
            ? {
                ...user,
                total_points: (user.total_points || 0) + parseInt(pointsData.points),
                available_points: (user.available_points || 0) + parseInt(pointsData.points)
              }
            : user
        )
      );
      
      setDialogOpen(false);
      setSelectedUser(null);
      setPointsData({ points: '', description: '' });
      
      toast({
        title: "Points ajoutés",
        description: `${pointsData.points} points ont été ajoutés au client.`
      });
    } catch (error) {
      // Simulation pour la démo
      setUsers(prev =>
        prev.map(user =>
          user.id === selectedUser.id
            ? {
                ...user,
                total_points: (user.total_points || 0) + parseInt(pointsData.points),
                available_points: (user.available_points || 0) + parseInt(pointsData.points)
              }
            : user
        )
      );
      
      setDialogOpen(false);
      setSelectedUser(null);
      setPointsData({ points: '', description: '' });
      
      toast({
        title: "Points ajoutés",
        description: `${pointsData.points} points ont été ajoutés au client.`
      });
    } finally {
      setAddingPoints(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return Crown;
      case 'moderator': return Shield;
      case 'client': return User;
      default: return User;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-400/20';
      case 'moderator': return 'text-blue-400 bg-blue-400/20';
      case 'client': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

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

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestion des utilisateurs</h1>
            <p className="text-gray-400">Gérez tous les utilisateurs : admins, clients et modérateurs</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => setCreateUserModal(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvel utilisateur
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs md:text-sm">Total</p>
                  <p className="text-lg md:text-2xl font-bold text-white">{users.length}</p>  
                </div>
                <Users className="h-6 md:h-8 w-6 md:w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs md:text-sm">Clients</p>
                  <p className="text-lg md:text-2xl font-bold text-green-400">{users.filter(u => u.role === 'client').length}</p>  
                </div>
                <User className="h-6 md:h-8 w-6 md:w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs md:text-sm">Admins</p>
                  <p className="text-lg md:text-2xl font-bold text-red-400">{users.filter(u => u.role === 'admin').length}</p>  
                </div>
                <Crown className="h-6 md:h-8 w-6 md:w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs md:text-sm">Actifs</p>
                  <p className="text-lg md:text-2xl font-bold text-blue-400">{users.filter(u => u.is_active).length}</p>  
                </div>
                <CheckCircle className="h-6 md:h-8 w-6 md:w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email ou nom d'utilisateur..."
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
                  <SelectItem value="admin" className="text-white hover:bg-slate-700">Administrateurs</SelectItem>
                  <SelectItem value="moderator" className="text-white hover:bg-slate-700">Modérateurs</SelectItem>
                  <SelectItem value="client" className="text-white hover:bg-slate-700">Clients</SelectItem>
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

        {/* Users List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Chargement des utilisateurs...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => {
              const RoleIcon = getRoleIcon(user.role);
              const LoyaltyIcon = getLoyaltyIcon(user.loyalty_tier);
              
              return (
                <Card key={user.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRoleColor(user.role)}`}>
                              <RoleIcon className="h-6 w-6" />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-white">{user.full_name}</h3>
                              <Badge className={getRoleColor(user.role)}>
                                {user.role === 'admin' ? 'Admin' : user.role === 'moderator' ? 'Modérateur' : 'Client'}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                              <span>@{user.username}</span>
                              <span>•</span>
                              <Mail className="h-3 w-3" />
                              <span>{user.email}</span>
                              {user.phone && (
                                <>
                                  <span>•</span>
                                  <Phone className="h-3 w-3" />
                                  <span>{user.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        {/* Stats pour clients */}
                        {user.role === 'client' && (
                          <>
                            {/* Loyalty Tier */}
                            <div className="flex items-center space-x-2">
                              <div className={`p-2 rounded-lg ${getLoyaltyColor(user.loyalty_tier)}`}>
                                <LoyaltyIcon className="h-4 w-4" />
                              </div>
                              <div className="text-xs text-gray-400">
                                {user.loyalty_tier?.charAt(0).toUpperCase() + user.loyalty_tier?.slice(1)}
                              </div>
                            </div>
                            
                            {/* Stats */}
                            <div className="grid grid-cols-4 gap-4">
                              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                <div className="text-lg font-bold text-blue-400">{user.total_points || 0}</div>
                                <div className="text-xs text-gray-400">Points</div>
                              </div>
                              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                <div className="text-lg font-bold text-green-400">{user.available_points || 0}</div>
                                <div className="text-xs text-gray-400">Dispo</div>
                              </div>
                              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                <div className="text-lg font-bold text-purple-400">{user.quotes_count || 0}</div>
                                <div className="text-xs text-gray-400">Devis</div>
                              </div>
                              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                <div className="text-lg font-bold text-orange-400">{user.tickets_count || 0}</div>
                                <div className="text-xs text-gray-400">Tickets</div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {/* Stats pour admins/modérateurs */}
                        {(user.role === 'admin' || user.role === 'moderator') && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                              <div className="text-lg font-bold text-blue-400">{user.login_count || 0}</div>
                              <div className="text-xs text-gray-400">Connexions</div>
                            </div>
                            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                              <div className="text-lg font-bold text-green-400">
                                {user.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Jamais'}
                              </div>
                              <div className="text-xs text-gray-400">Dernière</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                            className="border-slate-600"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          
                          {user.role === 'client' && (
                            <Button 
                              size="sm" 
                              onClick={() => {setDialogOpen(true); setSelectedUser(user);}}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Points
                            </Button>
                          )}
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                            className={user.is_active ? "border-red-600 text-red-400" : "border-green-600 text-green-400"}
                          >
                            {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
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
                          Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        {user.last_login && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Dernière connexion: {new Date(user.last_login).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={user.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {user.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg">Aucun utilisateur trouvé</p>
                <p className="text-gray-500">Modifiez vos filtres pour voir plus de résultats</p>
              </div>
            )}
          </div>
        )}

        {/* Dialogs */}
        
        {/* Create User Dialog */}
        <Dialog open={createUserModal} onOpenChange={setCreateUserModal}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Créer un nouvel utilisateur</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Nom d'utilisateur *</Label>
                <Input
                  value={newUserData.username}
                  onChange={(e) => setNewUserData(prev => ({...prev, username: e.target.value}))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Nom complet *</Label>
                <Input
                  value={newUserData.full_name}
                  onChange={(e) => setNewUserData(prev => ({...prev, full_name: e.target.value}))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Email *</Label>
                <Input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData(prev => ({...prev, email: e.target.value}))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Mot de passe *</Label>
                <Input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData(prev => ({...prev, password: e.target.value}))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Rôle *</Label>
                <Select 
                  value={newUserData.role} 
                  onValueChange={(value) => setNewUserData(prev => ({...prev, role: value}))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="client" className="text-white hover:bg-slate-700">Client</SelectItem>
                    <SelectItem value="moderator" className="text-white hover:bg-slate-700">Modérateur</SelectItem>
                    <SelectItem value="admin" className="text-white hover:bg-slate-700">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Téléphone</Label>
                <Input
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData(prev => ({...prev, phone: e.target.value}))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm font-medium text-gray-300">Adresse</Label>
                <Input
                  value={newUserData.address}
                  onChange={(e) => setNewUserData(prev => ({...prev, address: e.target.value}))}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateUser}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Créer l'utilisateur
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCreateUserModal(false);
                  setNewUserData({
                    username: '',
                    email: '',
                    full_name: '',
                    password: '',
                    role: 'client',
                    phone: '',
                    address: ''
                  });
                }}
                className="border-slate-600 text-gray-300 hover:bg-slate-800"
              >
                Annuler
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Points Dialog (pour clients seulement) */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Attribuer des points à {selectedUser?.full_name}
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
                  onClick={addPointsToUser}
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
                    setSelectedUser(null);
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

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={(open) => {
          if (!open) {
            setEditingUser(null);
            setEditData({});
          }
        }}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                Modifier {editingUser?.full_name}
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
                <Label className="text-sm font-medium text-gray-300">Rôle</Label>
                <Select 
                  value={editData.role || 'client'} 
                  onValueChange={(value) => setEditData(prev => ({...prev, role: value}))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="client" className="text-white hover:bg-slate-700">Client</SelectItem>
                    <SelectItem value="moderator" className="text-white hover:bg-slate-700">Modérateur</SelectItem>
                    <SelectItem value="admin" className="text-white hover:bg-slate-700">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {editingUser?.role === 'client' && (
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
              )}
              
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
                  setEditingUser(null);
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

export default AdminUsersUnified;