
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Clock, 
  Settings, 
  Shield, 
  ChevronRight 
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const features = [
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "Gestion des Employés",
      description: "Profils complets des employés avec informations personnelles et professionnelles."
    },
    {
      icon: <Calendar className="w-10 h-10 text-primary" />,
      title: "Gestion des Congés",
      description: "Demandes de congés, approbations et suivi simplifiés pour toute l'organisation."
    },
    {
      icon: <DollarSign className="w-10 h-10 text-primary" />,
      title: "Gestion des Salaires",
      description: "Administration des salaires simplifiée avec suivi détaillé des rémunérations."
    },
    {
      icon: <Clock className="w-10 h-10 text-primary" />,
      title: "Suivi du Temps",
      description: "Suivi précis du temps avec surveillance et rapports de présence."
    },
    {
      icon: <Shield className="w-10 h-10 text-primary" />,
      title: "Accès Basé sur les Rôles",
      description: "Contrôle d'accès sécurisé avec permissions personnalisables pour différents rôles."
    },
    {
      icon: <Settings className="w-10 h-10 text-primary" />,
      title: "Paramètres Personnalisables",
      description: "Configuration flexible du système pour répondre aux besoins spécifiques de votre organisation."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Footer */}
      <footer className="py-12 bg-secondary/50 border-t">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold">RH Zénith</h2>
              <p className="text-sm text-muted-foreground">Solution Moderne de Gestion RH</p>
            </div>
            
            <div className="text-center md:text-right text-sm text-muted-foreground">
              <p>© 2023 RH Zénith. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
