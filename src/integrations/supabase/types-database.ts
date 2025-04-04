
import { Database as SupabaseDatabase } from './types';
import { Notification } from './types-notifications';

// Define interface for database that includes standard tables and notifications
export interface DatabaseWithNotifications extends Omit<SupabaseDatabase, 'public'> {
  public: {
    Tables: SupabaseDatabase['public']['Tables'] & {
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
    Views: SupabaseDatabase['public']['Views'];
    Functions: SupabaseDatabase['public']['Functions'];
    Enums: SupabaseDatabase['public']['Enums'];
    CompositeTypes: SupabaseDatabase['public']['CompositeTypes'];
  };
}

// Export a typed client
export type TypedSupabaseClient = ReturnType<typeof createClient<DatabaseWithNotifications>>;

// Helper to get the client with the extended type
import { createClient } from '@supabase/supabase-js';
