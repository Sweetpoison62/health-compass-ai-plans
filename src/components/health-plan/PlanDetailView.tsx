
import React from "react";
import { HealthPlan, Company } from "@/types";
import { useHealthData } from "@/context/HealthDataContext";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Heart,
  Phone,
  Pill,
  Shield,
  User,
  FileCheck,
  Building,
  DollarSign
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PlanDetailViewProps {
  plan: HealthPlan | null;
  open: boolean;
  onClose: () => void;
}

export function PlanDetailView({ plan, open, onClose }: PlanDetailViewProps) {
  const { companies, medicines, toggleFavoritePlan, favoritePlans } = useHealthData();
  
  if (!plan) return null;
  
  const company = companies.find(c => c.id === plan.companyId);
  const isFavorite = favoritePlans.includes(plan.id);
  const coveredMeds = medicines.filter(med => plan.coversMedicines.includes(med.id));
  const isActive = plan.active && company?.active;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl">{plan.name}</DialogTitle>
              <DialogDescription className="text-base">
                {company?.name}
              </DialogDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className="health-badge-primary text-base px-3 py-1">
                ${plan.price.toFixed(2)}/mo
              </Badge>
              {isActive ? (
                <Badge variant="outline" className="health-badge-success">Active</Badge>
              ) : (
                <Badge variant="outline" className="health-badge-muted">Inactive</Badge>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Plan Description */}
          <div>
            <h3 className="font-medium text-lg mb-2">About this plan</h3>
            <p className="text-muted-foreground">{plan.description}</p>
          </div>
          
          <Separator />
          
          {/* Coverage Summary */}
          <div>
            <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-health-blue-600" /> Coverage Summary
            </h3>
            <p>{plan.coverageSummary}</p>
          </div>
          
          {/* Covered Medicines */}
          {coveredMeds.length > 0 && (
            <div>
              <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                <Pill className="h-5 w-5 text-health-green-600" /> Covered Medicines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {coveredMeds.map(medicine => (
                  <div key={medicine.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                    <FileCheck className="h-4 w-4 text-health-green-600" />
                    <span>{medicine.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Plan Benefits */}
          <div>
            <h3 className="font-medium text-lg mb-3">Plan Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-health-blue-100 flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 text-health-blue-700" />
                </div>
                <div>
                  <h4 className="font-medium">Annual Check-ups</h4>
                  <p className="text-sm text-muted-foreground">Regular preventative care included</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-health-teal-100 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-health-teal-700" />
                </div>
                <div>
                  <h4 className="font-medium">Telehealth Services</h4>
                  <p className="text-sm text-muted-foreground">24/7 virtual doctor consultations</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-health-green-100 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-health-green-700" />
                </div>
                <div>
                  <h4 className="font-medium">Specialist Coverage</h4>
                  <p className="text-sm text-muted-foreground">Access to our network of specialists</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-health-blue-100 flex items-center justify-center shrink-0">
                  <Building className="h-4 w-4 text-health-blue-700" />
                </div>
                <div>
                  <h4 className="font-medium">Hospital Care</h4>
                  <p className="text-sm text-muted-foreground">Coverage for hospital stays</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-health-teal-600" />
              <div>
                <h4 className="font-medium">Monthly Premium</h4>
                <p className="text-lg font-bold">${plan.price.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <Badge variant={plan.priority > 2 ? "default" : "outline"} className="ml-2">
                {plan.priority > 2 ? "Recommended" : "Standard"}
              </Badge>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => toggleFavoritePlan(plan.id)}
            className={isFavorite ? "text-destructive border-destructive hover:text-destructive hover:border-destructive" : ""}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-destructive" : ""}`} />
            {isFavorite ? "Remove from Saved" : "Save Plan"}
          </Button>
          
          <Button disabled={!isActive}>
            Enroll Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
