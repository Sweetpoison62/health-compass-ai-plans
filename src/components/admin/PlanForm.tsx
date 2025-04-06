
import React, { useState } from "react";
import { useHealthData } from "@/context/HealthDataContext";
import { HealthPlan } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

interface PlanFormProps {
  mode: "add" | "edit";
  plan?: HealthPlan;
  onCancel: () => void;
}

export function PlanForm({ mode, plan, onCancel }: PlanFormProps) {
  const { companies, medicines, filters, createHealthPlan, updateHealthPlan, healthPlans } = useHealthData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<HealthPlan>>({
    id: plan?.id || uuidv4(),
    name: plan?.name || "",
    description: plan?.description || "",
    companyId: plan?.companyId || (companies.length > 0 ? companies[0].id : ""),
    coverageSummary: plan?.coverageSummary || "",
    price: plan?.price || 0,
    active: plan?.active !== undefined ? plan.active : true,
    priority: plan?.priority || 0,
    coversMedicines: plan?.coversMedicines || [],
    filters: plan?.filters || {},
    backupPlanId: plan?.backupPlanId || undefined,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  
  const handleSwitchChange = (checked: boolean, name: string) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleCompanyChange = (value: string) => {
    setFormData(prev => ({ ...prev, companyId: value }));
  };
  
  const handleBackupPlanChange = (value: string) => {
    setFormData(prev => ({ ...prev, backupPlanId: value === "none" ? undefined : value }));
  };
  
  const handleMedicineChange = (medicineId: string, checked: boolean) => {
    setFormData(prev => {
      const currentMedicines = [...(prev.coversMedicines || [])];
      
      if (checked && !currentMedicines.includes(medicineId)) {
        return { ...prev, coversMedicines: [...currentMedicines, medicineId] };
      } else if (!checked && currentMedicines.includes(medicineId)) {
        return { 
          ...prev, 
          coversMedicines: currentMedicines.filter(id => id !== medicineId)
        };
      }
      
      return prev;
    });
  };
  
  const handleFilterChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      filters: {
        ...(prev.filters || {}),
        [key]: value === "any" ? undefined : value
      }
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.companyId || formData.price === undefined) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Create the plan object
    const planData: HealthPlan = {
      id: formData.id!,
      name: formData.name,
      description: formData.description || "",
      companyId: formData.companyId,
      coverageSummary: formData.coverageSummary || "",
      price: formData.price,
      active: formData.active || false,
      priority: formData.priority || 0,
      coversMedicines: formData.coversMedicines || [],
      filters: formData.filters || {},
      backupPlanId: formData.backupPlanId,
    };
    
    if (mode === "add") {
      createHealthPlan(planData);
      toast({
        title: "Plan created",
        description: `${planData.name} has been created successfully.`,
      });
    } else {
      updateHealthPlan(planData);
      toast({
        title: "Plan updated",
        description: `${planData.name} has been updated successfully.`,
      });
    }
    
    onCancel();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Plan Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyId">Company *</Label>
          <Select
            value={formData.companyId}
            onValueChange={handleCompanyChange}
          >
            <SelectTrigger id="companyId">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="coverageSummary">Coverage Summary</Label>
        <Textarea
          id="coverageSummary"
          name="coverageSummary"
          value={formData.coverageSummary}
          onChange={handleInputChange}
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Monthly Price ($) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleNumberInputChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Input
            id="priority"
            name="priority"
            type="number"
            value={formData.priority}
            onChange={handleNumberInputChange}
            min="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="backupPlanId">Backup Plan</Label>
          <Select
            value={formData.backupPlanId || "none"}
            onValueChange={handleBackupPlanChange}
          >
            <SelectTrigger id="backupPlanId">
              <SelectValue placeholder="Select backup plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {healthPlans
                .filter(p => p.id !== formData.id)
                .map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active || false}
          onCheckedChange={checked => handleSwitchChange(checked, 'active')}
        />
        <Label htmlFor="active">Plan is Active</Label>
      </div>
      
      <div className="space-y-2">
        <Label>Covered Medicines</Label>
        <div className="border rounded-md p-4 max-h-40 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {medicines.map(medicine => (
              <div key={medicine.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`medicine-${medicine.id}`}
                  checked={formData.coversMedicines?.includes(medicine.id) || false}
                  onCheckedChange={checked => 
                    handleMedicineChange(medicine.id, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`medicine-${medicine.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {medicine.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Dynamic Filters */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Plan Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filters.map(filter => {
            if (filter.type === "dropdown" || filter.type === "multiselect") {
              return (
                <div key={filter.id} className="space-y-2">
                  <Label htmlFor={`filter-${filter.key}`}>{filter.name}</Label>
                  <Select
                    value={(formData.filters && formData.filters[filter.key]) || "any"}
                    onValueChange={value => handleFilterChange(filter.key, value)}
                  >
                    <SelectTrigger id={`filter-${filter.key}`}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      {filter.options?.map(option => (
                        <SelectItem key={option.id} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            } else if (filter.type === "boolean") {
              return (
                <div key={filter.id} className="flex items-center space-x-2">
                  <Switch
                    id={`filter-${filter.key}`}
                    checked={formData.filters?.[filter.key] || false}
                    onCheckedChange={checked => handleFilterChange(filter.key, checked)}
                  />
                  <Label htmlFor={`filter-${filter.key}`}>{filter.name}</Label>
                </div>
              );
            }
            
            return null;
          })}
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {mode === "add" ? "Create Plan" : "Update Plan"}
        </Button>
      </DialogFooter>
    </form>
  );
}
