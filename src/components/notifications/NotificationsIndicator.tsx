
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { asNotifications, Notification } from "@/integrations/supabase/types-notifications";
import { toast } from "sonner";

export function NotificationsIndicator() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // Query the notifications table
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Use the helper to type the response
      const typedNotifications = asNotifications(data || []);
      setNotifications(typedNotifications);
      setUnreadCount(typedNotifications.filter(n => !n.read).length);
    } catch (error: any) {
      console.error("Error fetching notifications:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Subscribe to real-time updates for notifications
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
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error("Error marking notification as read:", error.message);
      toast.error("Impossible de marquer comme lu");
    }
  };

  const markAllAsRead = async () => {
    if (notifications.length === 0 || unreadCount === 0) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);

      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
      toast.success("Toutes les notifications marquées comme lues");
    } catch (error: any) {
      console.error("Error marking all notifications as read:", error.message);
      toast.error("Impossible de marquer toutes les notifications comme lues");
    }
  };

  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center bg-red-500 text-white"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-sm md:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead}
              >
                Tout marquer comme lu
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border rounded-lg ${notification.read ? 'bg-muted/30' : 'bg-muted/10 border-blue-200 dark:border-blue-900'} transition-colors cursor-pointer`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <h4 className={`text-sm font-medium ${!notification.read ? 'text-primary' : 'text-muted-foreground'}`}>
                  {notification.title}
                </h4>
                <p className="text-sm mt-1 text-muted-foreground">
                  {notification.message}
                </p>
                <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                  <span>{new Date(notification.created_at).toLocaleDateString('fr-FR')}</span>
                  {!notification.read && <span className="text-blue-500 font-medium">Nouveau</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
