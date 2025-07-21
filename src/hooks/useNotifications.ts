import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  action_url?: string;
}

export const useNotifications = () => {
  const { organizationId } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organizationId) return;

    // Générer des notifications d'exemple basées sur les données CRM
    const generateSampleNotifications = (): Notification[] => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      return [
        {
          id: '1',
          title: 'Nouveau contact ajouté',
          message: 'Jean Dupont a été ajouté à vos contacts.',
          type: 'success',
          read: false,
          created_at: now.toISOString(),
          action_url: '/contacts',
        },
        {
          id: '2',
          title: 'Devis en attente',
          message: 'Le devis DEV-2024-001 attend votre validation.',
          type: 'warning',
          read: false,
          created_at: yesterday.toISOString(),
          action_url: '/devis',
        },
        {
          id: '3',
          title: 'Paiement reçu',
          message: 'Paiement de 1 250€ reçu pour la facture FAC-2024-012.',
          type: 'success',
          read: true,
          created_at: twoDaysAgo.toISOString(),
          action_url: '/paiements',
        },
        {
          id: '4',
          title: 'Tâche en retard',
          message: 'La tâche "Relance client ABC" devait être terminée hier.',
          type: 'error',
          read: false,
          created_at: yesterday.toISOString(),
          action_url: '/taches',
        },
        {
          id: '5',
          title: 'Nouvelle entreprise',
          message: 'TechCorp SAS a été ajoutée à votre portefeuille.',
          type: 'info',
          read: true,
          created_at: twoDaysAgo.toISOString(),
          action_url: '/entreprises',
        },
      ];
    };

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // Pour l'instant, utiliser les notifications d'exemple
        // Dans une vraie application, ceci serait une requête à la base de données
        const sampleNotifications = generateSampleNotifications();
        
        setNotifications(sampleNotifications);
        setUnreadCount(sampleNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [organizationId]);

  const markAsRead = async (notificationId: string) => {
    try {
      // Mettre à jour localement
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );

      // Mettre à jour le compteur
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Dans une vraie application, ceci serait une requête à la base de données
      // await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);

      // Dans une vraie application, ceci serait une requête à la base de données
      // await supabase.from('notifications').update({ read: true }).eq('organization_id', organizationId);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      // Dans une vraie application, ceci serait une requête à la base de données
      // await supabase.from('notifications').delete().eq('id', notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};