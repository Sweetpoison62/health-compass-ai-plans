
import React, { useState } from "react";
import { useHealthData } from "@/context/HealthDataContext";
import { Medicine } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Checkbox } from "@/components/ui/checkbox";

interface MedicineFormProps {
  mode: "add" | "edit";
  medicine?: Medicine;
  onCancel: () => void;
}

export function MedicineForm({ mode, medicine, onCancel }: MedicineFormProps) {
  const { createMedicine, updateMedicine, companies } = useHealthData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Medicine>({
    id: medicine?.id || uuidv4(),
    name: medicine?.name || "",
    description: medicine?.description || "",
    category: medicine?.category || "",
    manufacturer: medicine?.manufacturer || "",
    price: medicine?.price || 0,
    companyIds: medicine?.companyIds || [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleCompanyChange = (companyId: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          companyIds: [...prev.companyIds, companyId],
        };
      } else {
        return {
          ...prev,
          companyIds: prev.companyIds.filter((id) => id !== companyId),
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Medicine name is required.",
        variant: "destructive",
      });
      return;
    }

    if (mode === "add") {
      createMedicine(formData);
      toast({
        title: "Medicine created",
        description: `${formData.name} has been added successfully.`,
      });
    } else {
      updateMedicine(formData);
      toast({
        title: "Medicine updated",
        description: `${formData.name} has been updated successfully.`,
      });
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Medicine Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="e.g., Painkillers, Antibiotics"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input
            id="manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleInputChange}
            placeholder="e.g., Pfizer, Johnson & Johnson"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleNumberInputChange}
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label>Available From</Label>
        <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {companies.map((company) => (
              <div key={company.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`company-${company.id}`}
                  checked={formData.companyIds.includes(company.id)}
                  onCheckedChange={(checked) => 
                    handleCompanyChange(company.id, checked === true)
                  }
                />
                <Label 
                  htmlFor={`company-${company.id}`} 
                  className="text-sm font-normal cursor-pointer"
                >
                  {company.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {mode === "add" ? "Create Medicine" : "Update Medicine"}
        </Button>
      </DialogFooter>
    </form>
  );
}
