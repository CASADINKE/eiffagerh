
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { BulletinPaie, getAllBulletinsPaie } from "@/services/payslipService";
import { toast } from "sonner";

export default function PayslipList() {
  const [payslips, setPayslips] = useState<BulletinPaie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    setLoading(true);
    try {
      const data = await getAllBulletinsPaie();
      setPayslips(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des bulletins de paie:", error);
      toast.error("Impossible de charger les bulletins de paie");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayslip = (id: string) => {
    // Implémenter la visualisation du bulletin
    toast.info("Fonctionnalité de visualisation à venir");
  };

  const handleDownloadPayslip = (id: string) => {
    // Implémenter le téléchargement du bulletin
    toast.info("Fonctionnalité de téléchargement à venir");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Liste des Bulletins de Paie</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Chargement des bulletins de paie...
          </div>
        ) : payslips.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Aucun bulletin de paie trouvé
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead className="text-right">Salaire brut</TableHead>
                  <TableHead className="text-right">Net à Payer</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell className="font-medium">{payslip.matricule}</TableCell>
                    <TableCell>{payslip.nom}</TableCell>
                    <TableCell>{payslip.periode_paie}</TableCell>
                    <TableCell className="text-right">{payslip.total_brut.toLocaleString()} FCFA</TableCell>
                    <TableCell className="text-right">{payslip.net_a_payer.toLocaleString()} FCFA</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleViewPayslip(payslip.id)}
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleDownloadPayslip(payslip.id)}
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
