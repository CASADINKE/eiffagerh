
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { ReactNode, useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    if (userRole !== null) {
      setRoleChecked(true);
    }
  }, [userRole]);

  // Afficher l'état de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Vérifier les autorisations de rôle si nécessaire
  if (allowedRoles && allowedRoles.length > 0 && userRole) {
    if (!allowedRoles.includes(userRole)) {
      // Rediriger vers le tableau de bord si l'utilisateur n'a pas les autorisations requises
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Afficher les enfants si l'utilisateur est authentifié et a les autorisations requises
  return <>{children}</>;
};

export default ProtectedRoute;
