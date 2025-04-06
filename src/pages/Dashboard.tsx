
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FilterPanel } from "@/components/health-plan/FilterPanel";
import { PlanCard } from "@/components/health-plan/PlanCard";
import { useHealthData } from "@/context/HealthDataContext";
import { Heart, PlaneTakeoff, ThumbsUp, Search, Filter, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { 
    getRecommendedPlans, 
    companies, 
    favoritePlans, 
    searchQuery, 
    setSearchQuery,
    healthPlans
  } = useHealthData();
  
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const recommendedPlans = getRecommendedPlans();
  
  // Get top 3 recommended plans
  const topRecommendations = recommendedPlans.slice(0, 3);
  
  // Get favorite plans
  const savedPlans = recommendedPlans.filter(plan => favoritePlans.includes(plan.id));
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already active due to the onChange handler
  };

  // Calculate active plans count
  const activePlansCount = healthPlans.filter(plan => {
    const company = companies.find(c => c.id === plan.companyId);
    return plan.active && company?.active;
  }).length;
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Health Plan Dashboard</h1>
            <p className="text-muted-foreground">
              Find the perfect health plan tailored to your needs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-muted px-3 py-2 rounded-md text-sm">
              <span className="font-medium">{recommendedPlans.length}</span> plans found
            </div>
            <div className="bg-health-teal-100 text-health-teal-700 px-3 py-2 rounded-md text-sm">
              <span className="font-medium">{activePlansCount}</span> active plans
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search plans, medicines or companies..." 
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Filters sidebar - always visible on desktop, toggleable on mobile */}
          <div className={`col-span-12 lg:col-span-3 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <FilterPanel />
          </div>
          
          {/* Main content */}
          <div className="col-span-12 lg:col-span-9">
            {/* Plan Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Plans</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                {savedPlans.length > 0 && (
                  <TabsTrigger value="saved">
                    Saved
                    <span className="ml-1 h-5 w-5 rounded-full bg-primary/20 text-xs flex items-center justify-center">
                      {savedPlans.length}
                    </span>
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>

            {recommendedPlans.length === 0 && (
              <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>No plans found</AlertTitle>
                <AlertDescription>
                  Try adjusting your search criteria or filters to see more options.
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedPlans.map((plan) => (
                  <PlanCard 
                    key={plan.id} 
                    plan={plan} 
                    company={companies.find(c => c.id === plan.companyId)!} 
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recommended" className="mt-0">
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
                
                {/* More Plans */}
                {recommendedPlans.length > 3 && (
                  <>
                    <Separator className="my-8" />
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-8 w-8 rounded-full bg-health-green-100 flex items-center justify-center">
                        <PlaneTakeoff className="h-4 w-4 text-health-green-700" />
                      </div>
                      <h2 className="text-2xl font-semibold">More Plans</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendedPlans
                        .filter(plan => 
                          !topRecommendations.slice(0, 3).some(p => p.id === plan.id)
                        )
                        .map((plan) => (
                          <PlanCard 
                            key={plan.id} 
                            plan={plan} 
                            company={companies.find(c => c.id === plan.companyId)!} 
                          />
                        ))
                      }
                    </div>
                  </>
                )}
              </section>
            </TabsContent>
            
            <TabsContent value="saved" className="mt-0">
              {/* Saved Plans */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-full bg-health-blue-100 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-health-blue-700" />
                  </div>
                  <h2 className="text-2xl font-semibold">Saved Plans</h2>
                </div>
                
                {savedPlans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedPlans.map((plan) => (
                      <PlanCard 
                        key={plan.id} 
                        plan={plan} 
                        company={companies.find(c => c.id === plan.companyId)!} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12 bg-muted/50 rounded-lg">
                    <p>No saved plans yet. Save plans to compare them later.</p>
                  </div>
                )}
              </section>
            </TabsContent>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
