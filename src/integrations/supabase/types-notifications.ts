
import { Tables as SupabaseTables } from './types';

// Define the Notification type as extending from the Supabase tables
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  related_id: string | null;
  type: string | null;
}

// Add notifications to the Supabase database types
declare module './types' {
  interface Database {
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
            type?: string | null;
          };
          Update: {
            id?: string;
            user_id?: string;
            title?: string;
            message?: string;
            read?: boolean;
            created_at?: string;
            related_id?: string | null;
            type?: string | null;
          };
          Relationships: [];
        } & SupabaseTables;
      };
    };
  }
}

// Helper function to type cast the supabase response to Notification
export function asNotification(data: unknown): Notification {
  return data as Notification;
}

// Helper function to type cast an array of data to Notification[]
export function asNotifications(data: unknown[]): Notification[] {
  return data as Notification[];
}
