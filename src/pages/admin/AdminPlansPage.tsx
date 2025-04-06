
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useHealthData } from "@/context/HealthDataContext";
import { HealthPlan } from "@/types";
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PlanForm } from "@/components/admin/PlanForm";
import { Plus, FileEdit, Trash2, FileHeart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPlansPage() {
  const { healthPlans, companies, medicines, deleteHealthPlan } = useHealthData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<HealthPlan | null>(null);
  const { toast } = useToast();
  
  const handleDeletePlan = () => {
    if (currentPlan) {
      deleteHealthPlan(currentPlan.id);
      toast({
        title: "Plan deleted",
        description: `${currentPlan.name} has been deleted successfully.`,
      });
      setIsDeleteDialogOpen(false);
      setCurrentPlan(null);
    }
  };
  
  const openEditDialog = (plan: HealthPlan) => {
    setCurrentPlan(plan);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (plan: HealthPlan) => {
    setCurrentPlan(plan);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Health Plans</h1>
            <p className="text-muted-foreground">Manage your health plans</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Plan
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No health plans found. Add a new plan to get started.
                  </TableCell>
                </TableRow>
              ) : (
                healthPlans.map(plan => {
                  const company = companies.find(c => c.id === plan.companyId);
                  return (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{company?.name || "Unknown Company"}</TableCell>
                      <TableCell>${plan.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {plan.active ? (
                          <Badge variant="outline" className="health-badge-success">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="health-badge-muted">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>{plan.priority}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog(plan)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" 
                            size="sm"
                            onClick={() => openDeleteDialog(plan)}
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
      
      {/* Add Plan Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Health Plan</DialogTitle>
            <DialogDescription>
              Create a new health plan with the details below.
            </DialogDescription>
          </DialogHeader>
          <PlanForm 
            mode="add"
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Health Plan</DialogTitle>
            <DialogDescription>
              Update the health plan details.
            </DialogDescription>
          </DialogHeader>
          {currentPlan && (
            <PlanForm
              mode="edit"
              plan={currentPlan}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Plan Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Health Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this health plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePlan}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
