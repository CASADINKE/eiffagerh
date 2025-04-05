
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Remuneration } from "@/pages/GestionRemunerations";

interface RemunerationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Remuneration, 'id'> | Remuneration) => void;
  type: 'salaire' | 'sursalaire';
  initialData?: Remuneration;
}

export function RemunerationForm({ 
  isOpen, 
  onClose, 
  onSave,
  type,
  initialData
}: RemunerationFormProps) {
  const [formData, setFormData] = useState<Omit<Remuneration, 'id'>>({
    nom: '',
    description: '',
    montant: 0,
    type: 'salaire',
    categorie: type === 'salaire' ? 'a' : undefined
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          nom: initialData.nom,
          description: initialData.description,
          montant: initialData.montant,
          type: initialData.type,
          categorie: initialData.categorie
        });
      } else {
        setFormData({
          nom: '',
          description: '',
          montant: 0,
          type: type,
          categorie: type === 'salaire' ? 'a' : undefined
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData, type]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'montant' ? Number(value) : value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is changed
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le titre est requis';
    }
    
    if (formData.montant <= 0) {
      newErrors.montant = 'Le montant doit être supérieur à 0';
    }
    
    if (formData.type === 'salaire' && !formData.categorie) {
      newErrors.categorie = 'La catégorie est requise pour un salaire';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // If there's initialData with id, pass it through to preserve the id
      if (initialData?.id) {
        onSave({
          ...formData,
          id: initialData.id
        });
      } else {
        onSave(formData);
      }
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Modifier' : 'Ajouter'} {type === 'salaire' ? 'un salaire' : 'une prime'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Titre</Label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={errors.nom ? "border-red-500" : ""}
              />
              {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="montant">Montant (FCFA)</Label>
              <Input
                id="montant"
                name="montant"
                type="number"
                value={formData.montant}
                onChange={handleChange}
                min={0}
                className={errors.montant ? "border-red-500" : ""}
              />
              {errors.montant && <p className="text-red-500 text-xs mt-1">{errors.montant}</p>}
            </div>
            
            {type === 'salaire' && (
              <div className="space-y-2">
                <Label htmlFor="categorie">Catégorie</Label>
                <Select 
                  value={formData.categorie} 
                  onValueChange={(value) => handleSelectChange('categorie', value)}
                >
                  <SelectTrigger className={errors.categorie ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Catégorie A</SelectItem>
                    <SelectItem value="b">Catégorie B</SelectItem>
                    <SelectItem value="c">Catégorie C</SelectItem>
                  </SelectContent>
                </Select>
                {errors.categorie && <p className="text-red-500 text-xs mt-1">{errors.categorie}</p>}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">{initialData ? 'Mettre à jour' : 'Ajouter'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
