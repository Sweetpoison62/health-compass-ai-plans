
import { Company, DynamicFilter, HealthPlan, Medicine, User } from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@healthcompass.com",
    role: "admin",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "user-1",
    name: "Regular User",
    email: "user@example.com",
    role: "user",
    createdAt: new Date("2023-02-15"),
  },
];

// Mock Companies
export const mockCompanies: Company[] = [
  {
    id: "company-1",
    name: "MediSure Health",
    description: "Premium health insurance provider specializing in comprehensive coverage.",
    active: true,
    createdAt: new Date("2020-03-10"),
  },
  {
    id: "company-2",
    name: "LifeWell Insurance",
    description: "Affordable health plans for families and individuals.",
    active: true,
    createdAt: new Date("2018-08-22"),
  },
  {
    id: "company-3",
    name: "TotalCare Health Partners",
    description: "Specialized plans for chronic conditions and elderly care.",
    active: false,
    createdAt: new Date("2019-05-17"),
  },
];

// Mock Medicines
export const mockMedicines: Medicine[] = [
  { id: "med-1", name: "Metformin", description: "Diabetes medication" },
  { id: "med-2", name: "Lisinopril", description: "Blood pressure medication" },
  { id: "med-3", name: "Atorvastatin", description: "Cholesterol medication" },
  { id: "med-4", name: "Levothyroxine", description: "Thyroid medication" },
  { id: "med-5", name: "Albuterol", description: "Asthma medication" },
  { id: "med-6", name: "Omeprazole", description: "Acid reflux medication" },
  { id: "med-7", name: "Insulin Glargine", description: "Long-acting insulin" },
  { id: "med-8", name: "Fluoxetine", description: "Antidepressant" },
];

// Mock Dynamic Filters
export const mockFilters: DynamicFilter[] = [
  {
    id: "filter-1",
    name: "City",
    key: "city",
    type: "dropdown",
    options: [
      { id: "city-1", label: "New York", value: "new-york" },
      { id: "city-2", label: "Los Angeles", value: "los-angeles" },
      { id: "city-3", label: "Chicago", value: "chicago" },
      { id: "city-4", label: "Houston", value: "houston" },
      { id: "city-5", label: "Phoenix", value: "phoenix" },
    ],
  },
  {
    id: "filter-2",
    name: "Medical Conditions",
    key: "conditions",
    type: "multiselect",
    options: [
      { id: "condition-1", label: "Diabetes", value: "diabetes" },
      { id: "condition-2", label: "Hypertension", value: "hypertension" },
      { id: "condition-3", label: "Asthma", value: "asthma" },
      { id: "condition-4", label: "Heart Disease", value: "heart-disease" },
      { id: "condition-5", label: "Arthritis", value: "arthritis" },
    ],
  },
  {
    id: "filter-3",
    name: "Age Group",
    key: "ageGroup",
    type: "dropdown",
    options: [
      { id: "age-1", label: "18-29", value: "18-29" },
      { id: "age-2", label: "30-45", value: "30-45" },
      { id: "age-3", label: "46-60", value: "46-60" },
      { id: "age-4", label: "61+", value: "61+" },
    ],
  },
  {
    id: "filter-4",
    name: "Coverage Level",
    key: "coverageLevel",
    type: "dropdown",
    options: [
      { id: "coverage-1", label: "Basic", value: "basic" },
      { id: "coverage-2", label: "Standard", value: "standard" },
      { id: "coverage-3", label: "Premium", value: "premium" },
    ],
  },
  {
    id: "filter-5",
    name: "Monthly Budget",
    key: "monthlyBudget",
    type: "range",
    min: 50,
    max: 1000,
  },
  {
    id: "filter-6",
    name: "Family Coverage",
    key: "familyCoverage",
    type: "boolean",
  },
];

// Mock Health Plans
export const mockHealthPlans: HealthPlan[] = [
  {
    id: "plan-1",
    name: "Essential Care Plan",
    description: "Basic coverage for individuals with minimal healthcare needs.",
    companyId: "company-1",
    coverageSummary: "Covers routine checkups, emergency care, and basic prescriptions.",
    price: 199.99,
    active: true,
    priority: 1,
    coversMedicines: ["med-1", "med-2", "med-6"],
    filters: {
      city: ["new-york", "chicago"],
      conditions: [],
      ageGroup: "18-29",
      coverageLevel: "basic",
      monthlyBudget: 199.99,
      familyCoverage: false,
    },
  },
  {
    id: "plan-2",
    name: "Family First Plan",
    description: "Comprehensive coverage for families with children.",
    companyId: "company-2",
    coverageSummary: "Full coverage including dental, vision, and preventive care for all family members.",
    price: 499.99,
    active: true,
    priority: 2,
    coversMedicines: ["med-1", "med-2", "med-3", "med-4", "med-5", "med-6"],
    filters: {
      city: ["new-york", "los-angeles", "chicago", "houston", "phoenix"],
      conditions: [],
      ageGroup: "30-45",
      coverageLevel: "premium",
      monthlyBudget: 499.99,
      familyCoverage: true,
    },
  },
  {
    id: "plan-3",
    name: "Senior Care Plus",
    description: "Specialized coverage for seniors with chronic conditions.",
    companyId: "company-3",
    coverageSummary: "Extensive coverage for medications, specialists, and home care services.",
    price: 399.99,
    active: false, // Company is not active
    priority: 3,
    coversMedicines: ["med-1", "med-2", "med-3", "med-4", "med-7"],
    filters: {
      city: ["new-york", "chicago", "phoenix"],
      conditions: ["diabetes", "hypertension", "heart-disease", "arthritis"],
      ageGroup: "61+",
      coverageLevel: "premium",
      monthlyBudget: 399.99,
      familyCoverage: false,
    },
    backupPlanId: "plan-4",
  },
  {
    id: "plan-4",
    name: "Diabetes Management Plan",
    description: "Specialized plan for individuals with diabetes.",
    companyId: "company-1",
    coverageSummary: "Comprehensive coverage for diabetes medications, supplies, and specialist care.",
    price: 299.99,
    active: true,
    priority: 1,
    coversMedicines: ["med-1", "med-7"],
    filters: {
      city: ["new-york", "los-angeles", "chicago", "houston", "phoenix"],
      conditions: ["diabetes"],
      ageGroup: ["30-45", "46-60", "61+"],
      coverageLevel: "standard",
      monthlyBudget: 299.99,
      familyCoverage: false,
    },
  },
  {
    id: "plan-5",
    name: "Respiratory Care Plan",
    description: "Targeted plan for asthma and respiratory conditions.",
    companyId: "company-2",
    coverageSummary: "Covers inhalers, nebulizers, specialist visits, and related treatments.",
    price: 249.99,
    active: true,
    priority: 2,
    coversMedicines: ["med-5"],
    filters: {
      city: ["new-york", "los-angeles", "chicago"],
      conditions: ["asthma"],
      ageGroup: ["18-29", "30-45", "46-60"],
      coverageLevel: "standard",
      monthlyBudget: 249.99,
      familyCoverage: false,
    },
  },
];
