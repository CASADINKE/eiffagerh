
import { Tables as SupabaseTables } from './types';

// Define the notifications type to extend Supabase types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  related_id: string | null;
  type: string;
}

// Extend the Database type to add notifications
export interface NotificationsDatabase {
  public: {
    Tables: {
      notifications: {
        Row: Notification;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          read?: boolean;
          created_at?: string;
          related_id?: string | null;
          type?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          read?: boolean;
          created_at?: string;
          related_id?: string | null;
          type?: string;
        };
      };
    };
  };
}

// Helper function to type cast the supabase response to Notification
export function asNotification(data: unknown): Notification {
  return data as Notification;
}

// Helper function to type cast an array of data to Notification[]
export function asNotifications(data: unknown[]): Notification[] {
  return data as Notification[];
}
