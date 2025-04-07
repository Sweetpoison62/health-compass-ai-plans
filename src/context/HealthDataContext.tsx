import React, { createContext, useState, useContext, ReactNode } from "react";
import { 
  Company, 
  DynamicFilter, 
  FilterSelection, 
  HealthPlan, 
  Medicine 
} from "@/types";
import { 
  mockCompanies, 
  mockFilters, 
  mockHealthPlans, 
  mockMedicines 
} from "@/data/mockData";

interface HealthDataContextType {
  // Data
  companies: Company[];
  filters: DynamicFilter[];
  healthPlans: HealthPlan[];
  medicines: Medicine[];
  
  // Filters state
  filterSelections: FilterSelection;
  setFilterSelections: React.Dispatch<React.SetStateAction<FilterSelection>>;
  
  // Search state
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  
  // Methods
  getFilteredPlans: () => HealthPlan[];
  getRecommendedPlans: () => HealthPlan[];
  toggleFavoritePlan: (planId: string) => void;
  favoritePlans: string[];
  
  // Admin methods - Companies
  updateCompany: (company: Company) => void;
  createCompany: (company: Company) => void;
  deleteCompany: (companyId: string) => void;
  
  // Admin methods - Medicines
  updateMedicine: (medicine: Medicine) => void;
  createMedicine: (medicine: Medicine) => void;
  deleteMedicine: (medicineId: string) => void;
  getMedicinesByCompany: (companyId: string) => Medicine[];
  
  // Admin methods - Filters
  updateFilter: (filter: DynamicFilter) => void;
  createFilter: (filter: DynamicFilter) => void;
  deleteFilter: (filterId: string) => void;
  
  // Admin methods - Plans
  updateHealthPlan: (plan: HealthPlan) => void;
  createHealthPlan: (plan: HealthPlan) => void;
  deleteHealthPlan: (planId: string) => void;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider = ({ children }: { children: ReactNode }) => {
  // Data state
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [filters, setFilters] = useState<DynamicFilter[]>(mockFilters);
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>(mockHealthPlans);
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  
  // User selections
  const [filterSelections, setFilterSelections] = useState<FilterSelection>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favoritePlans, setFavoritePlans] = useState<string[]>([]);
  
  // Get filtered plans based on search and filters
  const getFilteredPlans = (): HealthPlan[] => {
    let filtered = [...healthPlans];
    
    // Filter by search query (plan name, company name, medicine)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(plan => {
        // Check plan name
        if (plan.name.toLowerCase().includes(query)) return true;
        
        // Check company name
        const company = companies.find(c => c.id === plan.companyId);
        if (company && company.name.toLowerCase().includes(query)) return true;
        
        // Check medicines
        if (plan.coversMedicines.some(medId => {
          const medicine = medicines.find(m => m.id === medId);
          return medicine && medicine.name.toLowerCase().includes(query);
        })) return true;
        
        return false;
      });
    }
    
    // Apply filter selections
    if (Object.keys(filterSelections).length > 0) {
      filtered = filtered.filter(plan => {
        // Check each filter
        for (const [key, value] of Object.entries(filterSelections)) {
          if (value === undefined || value === null) continue;
          
          // Skip empty array selections
          if (Array.isArray(value) && value.length === 0) continue;
          
          // Get the filter definition
          const filterDef = filters.find(f => f.key === key);
          if (!filterDef) continue;
          
          const planValue = plan.filters[key];
          
          switch (filterDef.type) {
            case "dropdown":
              if (planValue !== value && !planValue?.includes(value)) return false;
              break;
            
            case "multiselect":
              // If the user selected any conditions, the plan must cover at least one
              if (Array.isArray(value) && value.length > 0) {
                if (!Array.isArray(planValue)) return false;
                
                // Check if there's any overlap between selected conditions and plan conditions
                const hasMatch = value.some(v => planValue.includes(v));
                if (!hasMatch) return false;
              }
              break;
            
            case "boolean":
              if (planValue !== value) return false;
              break;
            
            case "range":
              // For budget range, plan price must be <= selected budget
              if (key === "monthlyBudget" && plan.price > value) return false;
              break;
              
            default:
              break;
          }
        }
        
        return true;
      });
    }
    
    // Sort by priority (higher is more important) and active status
    return filtered.sort((a, b) => {
      // Active plans from active companies first
      const companyA = companies.find(c => c.id === a.companyId);
      const companyB = companies.find(c => c.id === b.companyId);
      
      const aActive = a.active && companyA?.active;
      const bActive = b.active && companyB?.active;
      
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      
      // Then sort by priority
      return b.priority - a.priority;
    });
  };
  
  // Get specifically recommended plans based on logic
  const getRecommendedPlans = (): HealthPlan[] => {
    // In a real implementation, this would include complex rule-based logic
    // For this prototype, we'll use a simplified approach based on filters
    
    const filtered = getFilteredPlans();
    
    // Apply some basic recommendation logic
    if (filterSelections.conditions) {
      const conditions = Array.isArray(filterSelections.conditions) 
        ? filterSelections.conditions 
        : [filterSelections.conditions];
      
      if (conditions.includes("diabetes")) {
        // Prioritize plans that specifically mention diabetes
        return filtered.sort((a, b) => {
          const aDiabetes = a.filters.conditions?.includes("diabetes") ? 1 : 0;
          const bDiabetes = b.filters.conditions?.includes("diabetes") ? 1 : 0;
          
          if (aDiabetes !== bDiabetes) return bDiabetes - aDiabetes;
          
          // Check if plan covers diabetes medicines
          const aCoversMed = a.coversMedicines.some(medId => {
            const med = medicines.find(m => m.id === medId);
            return med && med.name.toLowerCase().includes("diabetes");
          }) ? 1 : 0;
          
          const bCoversMed = b.coversMedicines.some(medId => {
            const med = medicines.find(m => m.id === medId);
            return med && med.name.toLowerCase().includes("diabetes");
          }) ? 1 : 0;
          
          if (aCoversMed !== bCoversMed) return bCoversMed - aCoversMed;
          
          return 0;
        });
      }
    }
    
    return filtered;
  };
  
  // Toggle a plan as favorite
  const toggleFavoritePlan = (planId: string) => {
    setFavoritePlans(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId);
      } else {
        return [...prev, planId];
      }
    });
  };
  
  // Admin methods - Companies
  const updateCompany = (company: Company) => {
    setCompanies(prev => prev.map(c => c.id === company.id ? company : c));
  };
  
  const createCompany = (company: Company) => {
    setCompanies(prev => [...prev, company]);
  };
  
  const deleteCompany = (companyId: string) => {
    setCompanies(prev => prev.filter(c => c.id !== companyId));
  };
  
  // Admin methods - Medicines
  const updateMedicine = (medicine: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === medicine.id ? medicine : m));
  };
  
  const createMedicine = (medicine: Medicine) => {
    setMedicines(prev => [...prev, medicine]);
  };
  
  const deleteMedicine = (medicineId: string) => {
    setMedicines(prev => prev.filter(m => m.id !== medicineId));
    
    // Also remove this medicine from any health plans
    setHealthPlans(prev => prev.map(plan => ({
      ...plan,
      coversMedicines: plan.coversMedicines.filter(id => id !== medicineId)
    })));
  };
  
  const getMedicinesByCompany = (companyId: string): Medicine[] => {
    return medicines.filter(medicine => 
      medicine.companyIds.includes(companyId)
    );
  };
  
  // Admin methods - Filters
  const updateFilter = (filter: DynamicFilter) => {
    setFilters(prev => prev.map(f => f.id === filter.id ? filter : f));
  };
  
  const createFilter = (filter: DynamicFilter) => {
    setFilters(prev => [...prev, filter]);
  };
  
  const deleteFilter = (filterId: string) => {
    setFilters(prev => prev.filter(f => f.id !== filterId));
  };
  
  // Admin methods - Health Plans
  const updateHealthPlan = (plan: HealthPlan) => {
    setHealthPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
  };
  
  const createHealthPlan = (plan: HealthPlan) => {
    setHealthPlans(prev => [...prev, plan]);
  };
  
  const deleteHealthPlan = (planId: string) => {
    setHealthPlans(prev => prev.filter(p => p.id !== planId));
  };
  
  return (
    <HealthDataContext.Provider value={{
      companies,
      filters,
      healthPlans,
      medicines,
      filterSelections,
      setFilterSelections,
      searchQuery,
      setSearchQuery,
      getFilteredPlans,
      getRecommendedPlans,
      toggleFavoritePlan,
      favoritePlans,
      updateCompany,
      createCompany,
      deleteCompany,
      updateMedicine,
      createMedicine,
      deleteMedicine,
      getMedicinesByCompany,
      updateFilter,
      createFilter,
      deleteFilter,
      updateHealthPlan,
      createHealthPlan,
      deleteHealthPlan,
    }}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (context === undefined) {
    throw new Error("useHealthData must be used within a HealthDataProvider");
  }
  return context;
};
