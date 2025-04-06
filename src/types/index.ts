
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: Date;
}

export interface Medicine {
  id: string;
  name: string;
  description?: string;
}

export interface DynamicFilter {
  id: string;
  name: string;
  key: string;
  type: "dropdown" | "multiselect" | "boolean" | "range" | "text";
  options?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  min?: number;
  max?: number;
  required?: boolean;
}

export interface HealthPlan {
  id: string;
  name: string;
  description: string;
  companyId: string;
  company?: Company;
  coverageSummary: string;
  price: number;
  active: boolean;
  priority: number;
  coversMedicines: string[]; // medicine IDs
  filters: Record<string, any>; // dynamic filters, key is filter.key
  backupPlanId?: string;
}

export interface FilterSelection {
  [key: string]: any;
}
