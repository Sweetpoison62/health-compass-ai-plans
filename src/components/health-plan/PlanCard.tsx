
import React from "react";
import { HealthPlan, Company } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Pill } from "lucide-react";
import { useHealthData } from "@/context/HealthDataContext";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: HealthPlan;
  company: Company;
}

export function PlanCard({ plan, company }: PlanCardProps) {
  const { toggleFavoritePlan, favoritePlans, medicines } = useHealthData();
  
  const isActive = plan.active && company.active;
  const isFavorite = favoritePlans.includes(plan.id);
  
  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        isActive ? "opacity-100" : "opacity-70"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription className="text-sm">{company.name}</CardDescription>
          </div>
          <div className="flex gap-2">
            {isActive ? (
              <Badge variant="outline" className="health-badge-success">Active</Badge>
            ) : (
              <Badge variant="outline" className="health-badge-muted">Inactive</Badge>
            )}
            <Badge variant="outline" className="health-badge-primary">
              ${plan.price.toFixed(2)}/mo
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{plan.description}</p>
        <div className="text-sm">
          <p className="font-medium mb-2">Coverage Summary:</p>
          <p className="text-muted-foreground">{plan.coverageSummary}</p>
        </div>
        
        {plan.coversMedicines.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2 flex items-center gap-1">
              <Pill className="h-4 w-4" /> Covered Medicines:
            </p>
            <div className="flex flex-wrap gap-1">
              {plan.coversMedicines.map(medicineId => {
                const medicine = medicines.find(m => m.id === medicineId);
                return medicine ? (
                  <Badge key={medicineId} variant="outline" className="text-xs">
                    {medicine.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            isFavorite && "text-destructive border-destructive hover:text-destructive hover:border-destructive"
          )}
          onClick={() => toggleFavoritePlan(plan.id)}
        >
          <Heart className={cn("h-4 w-4 mr-2", isFavorite && "fill-destructive")} />
          {isFavorite ? "Saved" : "Save"}
        </Button>
        <Button 
          size="sm"
          disabled={!isActive}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
