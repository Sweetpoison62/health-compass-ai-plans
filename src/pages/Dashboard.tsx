
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FilterPanel } from "@/components/health-plan/FilterPanel";
import { PlanCard } from "@/components/health-plan/PlanCard";
import { useHealthData } from "@/context/HealthDataContext";
import { Heart, PlaneTakeoff, ThumbsUp } from "lucide-react";

export default function Dashboard() {
  const { getRecommendedPlans, companies, favoritePlans } = useHealthData();
  
  const recommendedPlans = getRecommendedPlans();
  
  // Get top 3 recommended plans
  const topRecommendations = recommendedPlans.slice(0, 3);
  
  // Get favorite plans
  const savedPlans = recommendedPlans.filter(plan => favoritePlans.includes(plan.id));
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Health Plan Dashboard</h1>
          <p className="text-muted-foreground">
            Find the perfect health plan tailored to your needs
          </p>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Filters sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <FilterPanel />
          </div>
          
          {/* Main content */}
          <div className="col-span-12 lg:col-span-9">
            {/* Top Recommendations */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-full bg-health-teal-100 flex items-center justify-center">
                  <ThumbsUp className="h-4 w-4 text-health-teal-700" />
                </div>
                <h2 className="text-2xl font-semibold">Top Recommendations</h2>
              </div>
              
              {topRecommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topRecommendations.map((plan) => (
                    <PlanCard 
                      key={plan.id} 
                      plan={plan} 
                      company={companies.find(c => c.id === plan.companyId)!} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-12 bg-muted/50 rounded-lg">
                  <p>No recommendations available. Try adjusting your filters.</p>
                </div>
              )}
            </section>
            
            {/* Saved Plans */}
            {savedPlans.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-full bg-health-blue-100 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-health-blue-700" />
                  </div>
                  <h2 className="text-2xl font-semibold">Saved Plans</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedPlans.map((plan) => (
                    <PlanCard 
                      key={plan.id} 
                      plan={plan} 
                      company={companies.find(c => c.id === plan.companyId)!} 
                    />
                  ))}
                </div>
              </section>
            )}
            
            {/* All Plans (if no recommendations) */}
            {!topRecommendations.length && !savedPlans.length && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-full bg-health-blue-100 flex items-center justify-center">
                    <PlaneTakeoff className="h-4 w-4 text-health-blue-700" />
                  </div>
                  <h2 className="text-2xl font-semibold">Explore All Plans</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedPlans.map((plan) => (
                    <PlanCard 
                      key={plan.id} 
                      plan={plan} 
                      company={companies.find(c => c.id === plan.companyId)!} 
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
