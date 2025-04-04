
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { asNotifications, Notification } from '@/integrations/supabase/types-notifications';

export function NotificationsIndicator() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    
    // Fetch notifications
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }
      
      // Use type assertion to handle notifications data
      const typedNotifications = asNotifications(data || []);
      setNotifications(typedNotifications);
      setUnreadCount(typedNotifications.filter(n => !n.read).length);
    };
    
    fetchNotifications();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchNotifications()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
  
  const handleMarkAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };
  
  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) return;
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user?.id)
      .eq('read', false);
    
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };
  
  const formatTimeAgo = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), {
      addSuffix: true,
      locale: fr,
    });
  };
  
  const navigateToRelatedContent = async (notification: Notification) => {
    if (notification.type === 'leave_request' && notification.related_id) {
      // Mark as read first
      await handleMarkAsRead(notification.id);
      
      // Close the notifications panel
      setIsOpen(false);
      
      // Navigate to the leave page
      window.location.href = '/leave';
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Notifications</SheetTitle>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              Tout marquer comme lu
            </Button>
          )}
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-4">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-md border ${notification.read ? 'bg-card' : 'bg-accent'} cursor-pointer`}
                onClick={() => navigateToRelatedContent(notification)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(notification.created_at)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                {!notification.read && (
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                    >
                      Marquer comme lu
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
