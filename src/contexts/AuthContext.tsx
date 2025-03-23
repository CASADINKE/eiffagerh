
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Définir le type pour les rôles
export type UserRole = 'super_admin' | 'admin' | 'manager' | 'employee';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
  checkUserRole: () => Promise<UserRole | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkUserRole = async (): Promise<UserRole | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du rôle:", error);
        return null;
      }

      return data?.role as UserRole;
    } catch (error) {
      console.error("Erreur lors de la vérification du rôle:", error);
      return null;
    }
  };

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur lorsque l'utilisateur change
    const getUserRole = async () => {
      if (user) {
        const role = await checkUserRole();
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    };

    getUserRole();
  }, [user]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If session is null (user logged out), redirect to auth page
        if (!session && !loading) {
          navigate("/auth");
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error("Erreur de connexion: " + error.message);
        return { error, success: false };
      }
      
      toast.success("Connexion réussie");
      navigate("/dashboard");
      return { error: null, success: true };
    } catch (error) {
      toast.error("Erreur inattendue lors de la connexion");
      return { error: error as Error, success: false };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast.error("Erreur d'inscription: " + error.message);
        return { error, success: false };
      }

      toast.success("Inscription réussie. Veuillez vérifier votre email.");
      return { error: null, success: true };
    } catch (error) {
      toast.error("Erreur inattendue lors de l'inscription");
      return { error: error as Error, success: false };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Vous avez été déconnecté");
      
      // Force navigation to auth page after logout
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRole,
        loading,
        signIn,
        signUp,
        signOut,
        checkUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
