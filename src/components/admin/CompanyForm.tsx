
import React, { useState } from "react";
import { useHealthData } from "@/context/HealthDataContext";
import { Company } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

// Array of countries for the multi-select
const COUNTRIES = [
  { id: "us", name: "United States" },
  { id: "ca", name: "Canada" },
  { id: "uk", name: "United Kingdom" },
  { id: "au", name: "Australia" },
  { id: "de", name: "Germany" },
  { id: "fr", name: "France" },
  { id: "jp", name: "Japan" },
  { id: "cn", name: "China" },
  { id: "in", name: "India" },
  { id: "br", name: "Brazil" },
];

interface CompanyFormProps {
  mode: "add" | "edit";
  company?: Company;
  onCancel: () => void;
}

export function CompanyForm({ mode, company, onCancel }: CompanyFormProps) {
  const { createCompany, updateCompany } = useHealthData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    id: company?.id || uuidv4(),
    name: company?.name || "",
    description: company?.description || "",
    active: company?.active !== undefined ? company.active : true,
    createdAt: company?.createdAt || new Date(),
    paymentMethods: company?.paymentMethods || "",
    countries: company?.countries || [] as string[],
    address: company?.address || "",
    contactEmail: company?.contactEmail || "",
    contactPhone: company?.contactPhone || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      active: checked,
    }));
  };

  const handleCountryChange = (countryId: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          countries: [...prev.countries, countryId],
        };
      } else {
        return {
          ...prev,
          countries: prev.countries.filter((id) => id !== countryId),
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
        description: "Company name is required.",
        variant: "destructive",
      });
      return;
    }

    // Create company object
    const companyData: Company = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      active: formData.active,
      createdAt: formData.createdAt,
      paymentMethods: formData.paymentMethods,
      countries: formData.countries,
      address: formData.address,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
    };

    if (mode === "add") {
      createCompany(companyData);
      toast({
        title: "Company created",
        description: `${companyData.name} has been added successfully.`,
      });
    } else {
      updateCompany(companyData);
      toast({
        title: "Company updated",
        description: `${companyData.name} has been updated successfully.`,
      });
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Company Name *</Label>
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
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={2}
            placeholder="Full company address"
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="contact@company.com"
            />
          </div>
          
          <div>
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethods">Accepted Payment Methods</Label>
        <Textarea
          id="paymentMethods"
          name="paymentMethods"
          value={formData.paymentMethods}
          onChange={handleInputChange}
          placeholder="e.g., PayPal, Bank Transfer, Credit Card"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Available Countries</Label>
        <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {COUNTRIES.map((country) => (
              <div key={country.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country.id}`}
                  checked={formData.countries.includes(country.id)}
                  onCheckedChange={(checked) => 
                    handleCountryChange(country.id, checked === true)
                  }
                />
                <Label 
                  htmlFor={`country-${country.id}`} 
                  className="text-sm font-normal cursor-pointer"
                >
                  {country.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="active">Company is Active</Label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {mode === "add" ? "Create Company" : "Update Company"}
        </Button>
      </DialogFooter>
    </form>
  );
}
