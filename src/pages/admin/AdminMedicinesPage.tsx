
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useHealthData } from "@/context/HealthDataContext";
import { Medicine } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MedicineForm } from "@/components/admin/MedicineForm";
import { Plus, FileEdit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminMedicinesPage() {
  const { medicines, companies, deleteMedicine } = useHealthData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const handleDeleteMedicine = () => {
    if (currentMedicine) {
      deleteMedicine(currentMedicine.id);
      toast({
        title: "Medicine deleted",
        description: `${currentMedicine.name} has been deleted successfully.`,
      });
      setIsDeleteDialogOpen(false);
      setCurrentMedicine(null);
    }
  };
  
  const openEditDialog = (medicine: Medicine) => {
    setCurrentMedicine(medicine);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (medicine: Medicine) => {
    setCurrentMedicine(medicine);
    setIsDeleteDialogOpen(true);
  };

  const filteredMedicines = medicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Medicines</h1>
            <p className="text-muted-foreground">Manage your medicines database</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Medicine
          </Button>
        </div>

        <div className="flex items-center mb-6">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search medicines..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available From</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No medicines match your search" : "No medicines found. Add a new medicine to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredMedicines.map(medicine => {
                  const availableFrom = medicine.companyIds
                    .map(id => companies.find(c => c.id === id)?.name)
                    .filter(Boolean)
                    .join(", ");
                    
                  return (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium">{medicine.name}</TableCell>
                      <TableCell>{medicine.category || "-"}</TableCell>
                      <TableCell>{medicine.manufacturer || "-"}</TableCell>
                      <TableCell>${medicine.price?.toFixed(2) || "-"}</TableCell>
                      <TableCell>
                        {availableFrom || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog(medicine)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" 
                            size="sm"
                            onClick={() => openDeleteDialog(medicine)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Add Medicine Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
            <DialogDescription>
              Create a new medicine with the details below.
            </DialogDescription>
          </DialogHeader>
          <MedicineForm 
            mode="add"
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Medicine Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Medicine</DialogTitle>
            <DialogDescription>
              Update the medicine details.
            </DialogDescription>
          </DialogHeader>
          {currentMedicine && (
            <MedicineForm
              mode="edit"
              medicine={currentMedicine}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Medicine Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Medicine</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this medicine? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMedicine}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
