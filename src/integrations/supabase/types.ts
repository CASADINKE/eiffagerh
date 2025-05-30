export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bulletins_paie: {
        Row: {
          created_at: string
          date_paiement: string | null
          id: string
          indemnite_deplacement: number
          ipres_general: number
          matricule: string
          mode_paiement: string | null
          net_a_payer: number
          nom: string
          periode_paie: string
          prime_transport: number
          retenue_ir: number
          salaire_base: number
          statut_paiement: string
          sursalaire: number
          total_brut: number
          trimf: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_paiement?: string | null
          id?: string
          indemnite_deplacement?: number
          ipres_general?: number
          matricule: string
          mode_paiement?: string | null
          net_a_payer?: number
          nom: string
          periode_paie: string
          prime_transport?: number
          retenue_ir?: number
          salaire_base?: number
          statut_paiement?: string
          sursalaire?: number
          total_brut?: number
          trimf?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_paiement?: string | null
          id?: string
          indemnite_deplacement?: number
          ipres_general?: number
          matricule?: string
          mode_paiement?: string | null
          net_a_payer?: number
          nom?: string
          periode_paie?: string
          prime_transport?: number
          retenue_ir?: number
          salaire_base?: number
          statut_paiement?: string
          sursalaire?: number
          total_brut?: number
          trimf?: number
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          birth_date: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          hire_date: string | null
          id: string
          position: string | null
          salary: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          hire_date?: string | null
          id: string
          position?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          hire_date?: string | null
          id?: string
          position?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      horaires_reference: {
        Row: {
          created_at: string
          heure_debut: string
          heure_fin: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          heure_debut: string
          heure_fin: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          heure_debut?: string
          heure_fin?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approved_by: string | null
          comments: string | null
          created_at: string
          employee_id: string
          end_date: string
          id: string
          reason: string | null
          start_date: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          comments?: string | null
          created_at?: string
          employee_id: string
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          comments?: string | null
          created_at?: string
          employee_id?: string
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listes_employées: {
        Row: {
          adresse: string
          affectation: string
          created_at: string
          date_naissance: string
          employeur: string
          id: string
          matricule: string
          nom: string
          poste: string
          prenom: string
          site: string
          telephone: string
          updated_at: string
        }
        Insert: {
          adresse: string
          affectation: string
          created_at?: string
          date_naissance: string
          employeur: string
          id?: string
          matricule: string
          nom: string
          poste: string
          prenom: string
          site: string
          telephone: string
          updated_at?: string
        }
        Update: {
          adresse?: string
          affectation?: string
          created_at?: string
          date_naissance?: string
          employeur?: string
          id?: string
          matricule?: string
          nom?: string
          poste?: string
          prenom?: string
          site?: string
          telephone?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          related_id: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          related_id?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          related_id?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payslips: {
        Row: {
          allowances: number
          base_salary: number
          created_at: string
          deductions: number
          employee_id: string
          generated_date: string
          id: string
          net_salary: number
          salary_payment_id: string | null
          status: string
          tax_amount: number
          updated_at: string
        }
        Insert: {
          allowances?: number
          base_salary: number
          created_at?: string
          deductions?: number
          employee_id: string
          generated_date?: string
          id?: string
          net_salary: number
          salary_payment_id?: string | null
          status?: string
          tax_amount?: number
          updated_at?: string
        }
        Update: {
          allowances?: number
          base_salary?: number
          created_at?: string
          deductions?: number
          employee_id?: string
          generated_date?: string
          id?: string
          net_salary?: number
          salary_payment_id?: string | null
          status?: string
          tax_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payslips_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payslips_salary_payment_id_fkey"
            columns: ["salary_payment_id"]
            isOneToOne: false
            referencedRelation: "salary_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      pointages: {
        Row: {
          created_at: string | null
          date_pointage: string
          duree_travail: string | null
          heure_arrivee: string | null
          heure_depart: string | null
          id: string
          remarque: string | null
          statut: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_pointage?: string
          duree_travail?: string | null
          heure_arrivee?: string | null
          heure_depart?: string | null
          id?: string
          remarque?: string | null
          statut?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_pointage?: string
          duree_travail?: string | null
          heure_arrivee?: string | null
          heure_depart?: string | null
          id?: string
          remarque?: string | null
          statut?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department_id: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      salaires: {
        Row: {
          created_at: string | null
          date_paiement: string | null
          id: string
          indemnite_deplacement: number
          ipres_general: number
          matricule: string
          mode_paiement: string | null
          net_a_payer: number
          nom: string
          periode_paie: string
          prime_transport: number
          retenue_ir: number
          salaire_base: number
          statut_paiement: string
          sursalaire: number
          trimf: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_paiement?: string | null
          id?: string
          indemnite_deplacement?: number
          ipres_general?: number
          matricule: string
          mode_paiement?: string | null
          net_a_payer?: number
          nom: string
          periode_paie: string
          prime_transport?: number
          retenue_ir?: number
          salaire_base?: number
          statut_paiement?: string
          sursalaire?: number
          trimf?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_paiement?: string | null
          id?: string
          indemnite_deplacement?: number
          ipres_general?: number
          matricule?: string
          mode_paiement?: string | null
          net_a_payer?: number
          nom?: string
          periode_paie?: string
          prime_transport?: number
          retenue_ir?: number
          salaire_base?: number
          statut_paiement?: string
          sursalaire?: number
          trimf?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      salary_details: {
        Row: {
          base_salary: number
          contract_type: string
          created_at: string
          currency: string
          employee_id: string
          id: string
          pay_grade: string | null
          payment_frequency: string
          tax_rate: number | null
          updated_at: string
        }
        Insert: {
          base_salary?: number
          contract_type?: string
          created_at?: string
          currency?: string
          employee_id: string
          id?: string
          pay_grade?: string | null
          payment_frequency?: string
          tax_rate?: number | null
          updated_at?: string
        }
        Update: {
          base_salary?: number
          contract_type?: string
          created_at?: string
          currency?: string
          employee_id?: string
          id?: string
          pay_grade?: string | null
          payment_frequency?: string
          tax_rate?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_details_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_payments: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          payment_date: string
          payment_method: string
          payment_period: string
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          payment_date: string
          payment_method: string
          payment_period: string
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          payment_date?: string
          payment_method?: string
          payment_period?: string
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      time_entries: {
        Row: {
          break_time: number | null
          clock_in: string | null
          clock_out: string | null
          created_at: string | null
          date: string
          employee_id: string
          id: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          break_time?: number | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          date: string
          employee_id: string
          id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          break_time?: number | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string
          id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
