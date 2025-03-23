
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
      title: "Employee Management",
      description: "Comprehensive employee profiles with personal and professional information."
    },
    {
      icon: <Calendar className="w-10 h-10 text-primary" />,
      title: "Leave Management",
      description: "Simplified leave requests, approvals and tracking for the entire organization."
    },
    {
      icon: <DollarSign className="w-10 h-10 text-primary" />,
      title: "Salary Management",
      description: "Streamlined salary administration with detailed compensation tracking."
    },
    {
      icon: <Clock className="w-10 h-10 text-primary" />,
      title: "Time Tracking",
      description: "Accurate time tracking with attendance monitoring and reporting."
    },
    {
      icon: <Shield className="w-10 h-10 text-primary" />,
      title: "Role-Based Access",
      description: "Secure access control with customizable permissions for different roles."
    },
    {
      icon: <Settings className="w-10 h-10 text-primary" />,
      title: "Customizable Settings",
      description: "Flexible system configuration to meet your organization's specific needs."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-[60%] -left-[5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.div 
              className="inline-block mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
                HR Management Solution
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Simplify Human Resources Management
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              A comprehensive HR platform designed to streamline employee management, leave tracking, salary administration, and time management in one elegant interface.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="mr-4 px-8"
                onClick={() => navigate("/dashboard")}
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-secondary/30"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <div className="container mx-auto px-6">
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comprehensive HR Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All the tools you need to manage your organization's human resources efficiently
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-card border rounded-xl p-6 hover:shadow-elevation-2 transition-all duration-300"
                variants={item}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your HR processes?</h2>
            <p className="text-muted-foreground mb-8">
              Start using our HR management solution and experience the difference in efficiency and employee satisfaction.
            </p>
            <Button 
              size="lg" 
              className="px-8"
              onClick={() => navigate("/dashboard")}
            >
              Explore the Dashboard
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-12 bg-secondary/50 border-t">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold">HR Zenith</h2>
              <p className="text-sm text-muted-foreground">Modern HR Management Solution</p>
            </div>
            
            <div className="text-center md:text-right text-sm text-muted-foreground">
              <p>© 2023 HR Zenith. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
