
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealthData } from "@/context/HealthDataContext";
import { 
  BarChart, 
  Building, 
  FileHeart, 
  Filter, 
  Users 
} from "lucide-react";

export default function AdminDashboard() {
  const { companies, healthPlans, filters } = useHealthData();
  
  const activeCompanies = companies.filter(c => c.active);
  const activePlans = healthPlans.filter(p => p.active);
  
  const stats = [
    {
      title: "Total Companies",
      value: companies.length,
      active: activeCompanies.length,
      icon: Building,
      color: "text-health-blue-600",
      bgColor: "bg-health-blue-100",
    },
    {
      title: "Total Health Plans",
      value: healthPlans.length,
      active: activePlans.length,
      icon: FileHeart,
      color: "text-health-teal-600",
      bgColor: "bg-health-teal-100",
    },
    {
      title: "Dynamic Filters",
      value: filters.length,
      active: filters.length,
      icon: Filter,
      color: "text-health-green-600",
      bgColor: "bg-health-green-100",
    },
    {
      title: "Registered Users",
      value: 1, // In our mock data, we only have 1 regular user
      active: 1,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your health plans, companies, and users
          </p>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-full`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground pt-1">
                  {stat.active} active {stat.active === 1 ? "item" : "items"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Health Plan Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Health Plan Distribution</CardTitle>
              <CardDescription>Plan coverage by company</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
              <div className="flex items-center justify-center flex-col">
                <BarChart className="h-16 w-16 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Charts and analytics will be available in the full version
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>System updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-health-blue-100 flex items-center justify-center">
                    <Building className="h-4 w-4 text-health-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">MediSure Health activated</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-health-teal-100 flex items-center justify-center">
                    <FileHeart className="h-4 w-4 text-health-teal-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New plan added: Family First Plan</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-health-green-100 flex items-center justify-center">
                    <Filter className="h-4 w-4 text-health-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New filter added: Condition</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
