import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { notificationsAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';
import { 
  Plus, 
  Bell, 
  BellDot,
  Check, 
  CheckCheck, 
  Trash2, 
  Filter, 
  RefreshCw,
  User,
  Mail,
  FileText,
  HelpCircle,
  Settings,
  ShieldAlert,
  Wrench,
  Calendar,
  ExternalLink,
  Search,
  AlertTriangle,
  Info,
  Loader2
} from 'lucide-react';

const NOTIFICATION_TYPES = {
  "NEW_USER": {
    title: "Nouvel utilisateur",
    icon: User,
    color: "blue"
  },
  "NEW_CONTACT": {
    title: "Nouveau message de contact",
    icon: Mail,
    color: "green" 
  },
  "NEW_QUOTE": {
    title: "Nouvelle demande de devis",
    icon: FileText,
    color: "orange"
  },
  "NEW_TICKET": {
    title: "Nouveau ticket de support",
    icon: HelpCircle,
    color: "red"
  },
  "SYSTEM_UPDATE": {
    title: "Mise à jour système",
    icon: Settings,
    color: "purple"
  },
  "SECURITY_ALERT": {
    title: "Alerte de sécurité",
    icon: ShieldAlert,
    color: "red"
  },
  "MAINTENANCE": {
    title: "Maintenance programmée",
    icon: Tools,
    color: "yellow"
  }
};

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0
  });
  const [formData, setFormData] = useState({
    type: 'SYSTEM_UPDATE',
    title: '',
    message: '',
    link: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, [filter, searchTerm]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      
      if (filter !== 'all') {
        if (filter === 'unread') {
          params.read_status = 'unread';
        } else if (filter === 'read') {
          params.read_status = 'read';
        } else {
          params.type_filter = filter;
        }
      }
      
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response = await notificationsAPI.getAll(params);
      if (response.data.success) {
        const notificationsList = response.data.data.notifications || [];
        setNotifications(notificationsList);
        
        // Calculer les stats
        const unreadCount = notificationsList.filter(n => !n.read).length;
        setStats({
          total: notificationsList.length,
          unread: unreadCount,
          read: notificationsList.length - unreadCount
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Données mockées en cas d'erreur
      const mockNotifications = [
        {
          id: '1',
          type: 'NEW_USER',
          title: 'Nouvel utilisateur inscrit',
          message: 'Jean Dupont (jean@example.com) vient de s\'inscrire',
          link: '/admin/users',
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'NEW_CONTACT',
          title: 'Nouveau message de contact',
          message: 'Marie Martin a envoyé un message: Demande d\'information',
          link: '/admin/contacts',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          type: 'SYSTEM_UPDATE',
          title: 'Mise à jour système v0.5.5',
          message: 'Le système a été mis à jour avec de nouvelles fonctionnalités',
          link: '/admin/settings',
          read: true,
          createdAt: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      
      setNotifications(mockNotifications);
      const unreadCount = mockNotifications.filter(n => !n.read).length;
      setStats({
        total: mockNotifications.length,
        unread: unreadCount,
        read: mockNotifications.length - unreadCount
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };

  const resetForm = () => {
    setFormData({
      type: 'SYSTEM_UPDATE',
      title: '',
      message: '',
      link: ''
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await notificationsAPI.create(
        formData.type,
        formData.title,
        formData.message,
        formData.link || null
      );

      if (response.data.success) {
        toast({
          title: "Notification créée !",
          description: "La notification a été créée avec succès.",
        });
        setIsCreateModalOpen(false);
        resetForm();
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read: true, readAt: new Date().toISOString() }
            : n
        )
      );
      fetchNotifications(); // Refresh pour recalculer les stats
    } catch (error) {
      console.error('Error marking as read:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue.",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      toast({
        title: "Succès",
        description: "Toutes les notifications ont été marquées comme lues."
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications comme lues.",
        variant: "destructive"
      });
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      return;
    }

    try {
      await notificationsAPI.delete(notificationId);
      toast({
        title: "Notification supprimée",
        description: "La notification a été supprimée avec succès."
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la notification.",
        variant: "destructive"
      });
    }
  };

  const deleteOldNotifications = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications de plus de 30 jours ?')) {
      return;
    }

    try {
      await notificationsAPI.deleteOld(30);
      toast({
        title: "Notifications supprimées",
        description: "Les anciennes notifications ont été supprimées."
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting old notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les anciennes notifications.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 2592000000) return `${Math.floor(diff / 86400000)}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 truncate">Gestion des notifications</h1>
            <p className="text-gray-400 text-sm sm:text-base">Gérez les notifications système et créez de nouvelles alertes</p>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="sm:inline">Nouvelle notification</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>  
                </div>
                <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Non lues</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-400">{stats.unread}</p>  
                </div>
                <BellDot className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Lues</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.read}</p>  
                </div>
                <Check className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher dans les notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Filtrer" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="all" className="text-white hover:bg-slate-700">Toutes</SelectItem>
                    <SelectItem value="unread" className="text-white hover:bg-slate-700">Non lues</SelectItem>
                    <SelectItem value="read" className="text-white hover:bg-slate-700">Lues</SelectItem>
                    <SelectItem value="NEW_USER" className="text-white hover:bg-slate-700">Nouveaux utilisateurs</SelectItem>
                    <SelectItem value="NEW_CONTACT" className="text-white hover:bg-slate-700">Messages de contact</SelectItem>
                    <SelectItem value="NEW_QUOTE" className="text-white hover:bg-slate-700">Demandes de devis</SelectItem>
                    <SelectItem value="SYSTEM_UPDATE" className="text-white hover:bg-slate-700">Mises à jour</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchNotifications}
                    disabled={loading}
                    className="border-slate-600"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline ml-2">Actualiser</span>
                  </Button>
                  
                  {stats.unread > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAsRead}
                      className="border-slate-600"
                    >
                      <CheckCheck className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Tout marquer lu</span>
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteOldNotifications}
                    className="border-slate-600 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Nettoyer</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Chargement des notifications...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const typeConfig = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.SYSTEM_UPDATE;
              const IconComponent = typeConfig.icon;
              
              return (
                <Card key={notification.id} className={`bg-slate-900/50 backdrop-blur-sm border-slate-700 transition-all duration-200 ${!notification.read ? 'ring-1 ring-blue-500/20' : ''}`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                        typeConfig.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                        typeConfig.color === 'green' ? 'bg-green-500/10 text-green-400' :
                        typeConfig.color === 'orange' ? 'bg-orange-500/10 text-orange-400' :
                        typeConfig.color === 'red' ? 'bg-red-500/10 text-red-400' :
                        typeConfig.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h3 className={`font-semibold text-sm sm:text-base truncate ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <Badge variant="secondary" className="bg-slate-800 text-gray-300 text-xs">
                              {typeConfig.title}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className={`mb-3 text-sm ${notification.read ? 'text-gray-400' : 'text-gray-300'}`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            {formatDate(notification.createdAt)}
                          </div>
                          
                          <div className="flex items-center gap-1 sm:gap-2">
                            {notification.link && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  window.open(notification.link, '_blank');
                                  if (!notification.read) {
                                    markAsRead(notification.id);
                                  }
                                }}
                                className="text-gray-400 hover:text-white text-xs h-7 px-2"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Voir</span>
                              </Button>
                            )}
                            
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-gray-400 hover:text-green-400 h-7 px-2"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-gray-400 hover:text-red-400 h-7 px-2"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-base sm:text-lg">Aucune notification trouvée</p>
                <p className="text-gray-500 text-sm">Les notifications apparaîtront ici</p>
              </div>
            )}
          </div>
        )}

        {/* Create Notification Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Nouvelle notification</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type de notification *
                </label>
                <Select value={formData.type} onValueChange={handleSelectChange}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {Object.entries(NOTIFICATION_TYPES).map(([key, config]) => (
                      <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                        {config.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Titre *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="bg-slate-800 border-slate-600 text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lien (optionnel)
                </label>
                <Input
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="/admin/users"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Création...
                    </>
                  ) : (
                    'Créer la notification'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                  }}
                  className="border-slate-600 text-gray-300 hover:bg-slate-800"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;