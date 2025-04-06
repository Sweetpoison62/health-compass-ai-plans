
import React, { useState } from "react";
import { HealthPlan, Company } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Pill, Shield, CheckCircle } from "lucide-react";
import { useHealthData } from "@/context/HealthDataContext";
import { cn } from "@/lib/utils";
import { PlanDetailView } from "./PlanDetailView";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PlanCardProps {
  plan: HealthPlan;
  company: Company;
}

export function PlanCard({ plan, company }: PlanCardProps) {
  const { toggleFavoritePlan, favoritePlans, medicines } = useHealthData();
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  
  const isActive = plan.active && company.active;
  const isFavorite = favoritePlans.includes(plan.id);
  
  // Calculate how many medicines are covered
  const medicinesCovered = plan.coversMedicines.length;
  const medicinePercentage = medicines.length > 0 
    ? Math.round((medicinesCovered / medicines.length) * 100)
    : 0;
  
  return (
    <>
      <Card 
        className={cn(
          "transition-all duration-200 hover:shadow-md border-l-4",
          isActive ? "opacity-100" : "opacity-70",
          plan.priority > 2 ? "border-l-health-teal-500" : 
            (plan.priority > 0 ? "border-l-health-blue-400" : "border-l-transparent"),
          isFavorite && "ring-1 ring-destructive ring-offset-1"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl group flex items-center gap-1">
                {plan.name}
                {plan.priority > 2 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CheckCircle className="h-4 w-4 text-health-teal-500 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Recommended Plan</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </CardTitle>
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
          <div className="text-sm mb-4 line-clamp-2">
            {plan.description || plan.coverageSummary}
          </div>
          
          <div className="bg-muted/30 p-3 rounded-md mb-4">
            <div className="flex justify-between text-sm mb-2">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-health-blue-600" />
                <span className="font-medium">Coverage Details</span>
              </div>
              <span className="text-muted-foreground">{medicinePercentage}% of medicines</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{plan.coverageSummary}</p>
          </div>
          
          {plan.coversMedicines.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1">
                <Pill className="h-3 w-3" /> Covered Medicines:
              </p>
              <div className="flex flex-wrap gap-1">
                {plan.coversMedicines.slice(0, 3).map(medicineId => {
                  const medicine = medicines.find(m => m.id === medicineId);
                  return medicine ? (
                    <Badge key={medicineId} variant="outline" className="text-xs">
                      {medicine.name}
                    </Badge>
                  ) : null;
                })}
                {plan.coversMedicines.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{plan.coversMedicines.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "hover:bg-transparent",
              isFavorite && "text-destructive hover:text-destructive/90"
            )}
            onClick={() => toggleFavoritePlan(plan.id)}
          >
            <Heart className={cn("h-4 w-4 mr-2", isFavorite && "fill-destructive")} />
            {isFavorite ? "Saved" : "Save"}
          </Button>
          <Button 
            variant="default"
            size="sm"
            disabled={!isActive}
            onClick={() => setIsDetailViewOpen(true)}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
      
      <PlanDetailView 
        plan={plan} 
        open={isDetailViewOpen} 
        onClose={() => setIsDetailViewOpen(false)} 
      />
    </>
  );
}
