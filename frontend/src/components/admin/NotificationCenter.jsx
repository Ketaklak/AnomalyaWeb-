import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
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
  Tools,
  Calendar,
  ExternalLink,
  X
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { notificationsAPI } from '../../services/api';

// Mapping des icônes selon le type
const NOTIFICATION_ICONS = {
  "NEW_USER": User,
  "NEW_CONTACT": Mail,
  "NEW_QUOTE": FileText,
  "NEW_TICKET": HelpCircle,
  "SYSTEM_UPDATE": Settings,
  "SECURITY_ALERT": ShieldAlert,
  "MAINTENANCE": Tools,
};

// Mapping des couleurs selon le type
const NOTIFICATION_COLORS = {
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  green: "bg-green-500/10 border-green-500/20 text-green-400",
  orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  red: "bg-red-500/10 border-red-500/20 text-red-400",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
};

const NotificationCenter = ({ 
  onNotificationCountChange,
  className = "" 
}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { toast } = useToast();

  // Fonction pour récupérer les notifications
  const fetchNotifications = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const params = {
        page: currentPage,
        limit: 20
      };
      
      if (filter !== 'all') {
        if (filter === 'unread') {
          params.read_status = 'unread';
        } else if (filter === 'read') {
          params.read_status = 'read';
        } else {
          params.type_filter = filter;
        }
      }

      const response = await notificationsAPI.getAll(params);
      
      if (response.data.success) {
        const newNotifications = response.data.data.notifications || [];
        setNotifications(reset ? newNotifications : [...notifications, ...newNotifications]);
        setHasMore(response.data.data.hasMore || false);
        if (reset) setPage(1);
      }
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
      
      // Données mockées en cas d'erreur pour le développement
      const mockNotifications = [
        {
          id: '1',
          type: 'NEW_USER',
          title: 'Nouvel utilisateur inscrit',
          message: 'Jean Dupont (jean@example.com) vient de s\'inscrire',
          link: '/admin/users',
          read: false,
          createdAt: new Date().toISOString(),
          color: 'blue',
          icon: 'user-plus'
        },
        {
          id: '2',
          type: 'NEW_CONTACT',
          title: 'Nouveau message de contact',
          message: 'Marie Martin a envoyé un message: Demande d\'information',
          link: '/admin/contacts',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          color: 'green',
          icon: 'mail'
        },
        {
          id: '3',
          type: 'NEW_QUOTE',
          title: 'Nouvelle demande de devis',
          message: 'Paul Durand a demandé un devis pour: Développement Web',
          link: '/admin/quotes',
          read: true,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          color: 'orange',
          icon: 'file-text'
        }
      ];
      
      setNotifications(reset ? mockNotifications : [...notifications, ...mockNotifications]);
      setHasMore(false);
      
      toast({
        title: "Mode développement",
        description: "Utilisation des données de test (API non disponible)",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  }, [page, filter, notifications, toast]);

  // Fonction pour récupérer le nombre de notifications non lues
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      
      if (response.data.success) {
        const count = response.data.data.unreadCount || 0;
        setUnreadCount(count);
        onNotificationCountChange?.(count);
      }
    } catch (error) {
      console.error('Erreur comptage notifications:', error);
      // Mock count pour le développement
      const mockCount = notifications.filter(n => !n.read).length;
      setUnreadCount(mockCount);
      onNotificationCountChange?.(mockCount);
    }
  }, [notifications, onNotificationCountChange]);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read: true, readAt: new Date().toISOString() }
            : n
        )
      );
      fetchUnreadCount();
    } catch (error) {
      console.error('Erreur marquage notification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
        variant: "destructive"
      });
    }
  }, [fetchUnreadCount, toast]);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsAPI.markAllAsRead();
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
      onNotificationCountChange?.(0);
      toast({
        title: "Succès",
        description: "Toutes les notifications ont été marquées comme lues"
      });
    } catch (error) {
      console.error('Erreur marquage toutes notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications comme lues",
        variant: "destructive"
      });
    }
  }, [onNotificationCountChange, toast]);

  // Supprimer une notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationsAPI.delete(notificationId);
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      fetchUnreadCount();
      toast({
        title: "Succès",
        description: "Notification supprimée"
      });
    } catch (error) {
      console.error('Erreur suppression notification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la notification",
        variant: "destructive"
      });
    }
  }, [fetchUnreadCount, toast]);

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 2592000000) return `${Math.floor(diff / 86400000)}j`;
    
    return date.toLocaleDateString('fr-FR');
  };

  // Charger les notifications au montage
  useEffect(() => {
    fetchNotifications(true);
    fetchUnreadCount();
  }, [filter]);

  // Polling pour les nouvelles notifications
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return (
    <>
      {/* Bouton de notification dans l'header */}
      <div className={`relative ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowModal(true)}
          className="relative p-2 text-gray-300 hover:text-white hover:bg-slate-800"
        >
          {unreadCount > 0 ? (
            <BellDot className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white border-slate-900"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Modal des notifications */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Centre de notifications
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchNotifications(true)}
                  disabled={loading}
                  className="text-gray-400 hover:text-white"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-gray-400 hover:text-white"
                  >
                    <CheckCheck className="h-4 w-4 mr-1" />
                    Tout marquer lu
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Filtres */}
          <div className="flex gap-2 mb-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                <SelectValue />
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
          </div>

          {/* Liste des notifications */}
          <div className="flex-1 overflow-y-auto max-h-96">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune notification</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => {
                  const IconComponent = NOTIFICATION_ICONS[notification.type] || Bell;
                  const colorClass = NOTIFICATION_COLORS[notification.color] || NOTIFICATION_COLORS.blue;
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        notification.read 
                          ? 'bg-slate-800/30 border-slate-700' 
                          : 'bg-slate-800/50 border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          
                          <p className={`text-sm ${notification.read ? 'text-gray-400' : 'text-gray-300'} mb-2`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {formatDate(notification.createdAt)}
                            </div>
                            
                            <div className="flex items-center gap-1">
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
                                  className="h-7 px-2 text-xs text-gray-400 hover:text-white"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Voir
                                </Button>
                              )}
                              
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-7 px-2 text-xs text-gray-400 hover:text-white"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-7 px-2 text-xs text-gray-400 hover:text-red-400"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {hasMore && (
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPage(prev => prev + 1);
                        fetchNotifications();
                      }}
                      disabled={loading}
                      className="border-slate-600 text-gray-300 hover:bg-slate-800"
                    >
                      {loading ? 'Chargement...' : 'Charger plus'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationCenter;