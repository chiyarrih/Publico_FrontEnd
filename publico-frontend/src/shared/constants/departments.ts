/**
 * Dagupan City LGU Departments and Categories
 * Centralized configuration for department selection across the application
 */

export interface DepartmentCategory {
  label: string;
  value: string;
  departments: Department[];
}

export interface Department {
  label: string;
  value: string;
}

/**
 * Complete list of Dagupan City LGU departments organized by functional categories
 */
export const DEPARTMENT_CATEGORIES: DepartmentCategory[] = [
  {
    label: "Executive & Administrative Services",
    value: "Executive & Administrative Services",
    departments: [
      { label: "City Mayor's Office", value: "City Mayor's Office" },
      { label: "City Administrator's Office", value: "City Administrator's Office" },
      { label: "Office of the Vice Mayor", value: "Office of the Vice Mayor" },
      { label: "Office of the SP Secretary", value: "Office of the SP Secretary" },
      { label: "City Legal Office", value: "City Legal Office" },
      { label: "Management Information System Office", value: "Management Information System Office" },
      { label: "Human Resources Office", value: "Human Resources Office" },
      { label: "City Budget Office", value: "City Budget Office" },
      { label: "City Information Office", value: "City Information Office" },
    ],
  },
  {
    label: "Public Safety & Disaster Management",
    value: "Public Safety & Disaster Management",
    departments: [
      { label: "City Disaster Risk Reduction & Management Office", value: "City Disaster Risk Reduction & Management Office" },
      { label: "Public Order & Safety Office", value: "Public Order & Safety Office" },
      { label: "Public Alert Response & Management Center", value: "Public Alert Response & Management Center" },
      { label: "PNP (Philippine National Police)", value: "PNP" },
      { label: "BFP (Bureau of Fire Protection)", value: "BFP" },
      { label: "Red Cross", value: "Red Cross" },
      { label: "PANDA Volunteers", value: "PANDA Volunteers" },
      { label: "DECORP", value: "DECORP" },
    ],
  },
  {
    label: "Health & Social Services",
    value: "Health & Social Services",
    departments: [
      { label: "City Health Office", value: "City Health Office" },
      { label: "City Social Welfare & Development Office", value: "City Social Welfare & Development Office" },
      { label: "Office for Senior Citizen's Affairs", value: "Office for Senior Citizen's Affairs" },
      { label: "City Nutrition Office", value: "City Nutrition Office" },
      { label: "City Population Office", value: "City Population Office" },
    ],
  },
  {
    label: "Infrastructure & Development",
    value: "Infrastructure & Development",
    departments: [
      { label: "City Engineering Office", value: "City Engineering Office" },
      { label: "City Planning & Development Office", value: "City Planning & Development Office" },
      { label: "Waste Management Division", value: "Waste Management Division" },
    ],
  },
  {
    label: "Economic Services & Business Development",
    value: "Economic Services & Business Development",
    departments: [
      { label: "City Tourism Office", value: "City Tourism Office" },
      { label: "City Agriculture Office", value: "City Agriculture Office" },
      { label: "City Veterinary Office", value: "City Veterinary Office" },
      { label: "City Market Division", value: "City Market Division" },
      { label: "One Stop Business Center", value: "One Stop Business Center" },
      { label: "Public Employment Office", value: "Public Employment Office" },
      { label: "PAMANA", value: "PAMANA" },
    ],
  },
  {
    label: "Financial Management & Revenue",
    value: "Financial Management & Revenue",
    departments: [
      { label: "City Accounting Office", value: "City Accounting Office" },
      { label: "City Treasury Office", value: "City Treasury Office" },
      { label: "City Assessor's Office", value: "City Assessor's Office" },
    ],
  },
  {
    label: "General Services & Support",
    value: "General Services & Support",
    departments: [
      { label: "City General Services Office", value: "City General Services Office" },
      { label: "City Civil Registry Office", value: "City Civil Registry Office" },
    ],
  },
];

/**
 * Flat list of all departments (for simple dropdowns without categories)
 */
export const ALL_DEPARTMENTS: Department[] = DEPARTMENT_CATEGORIES.flatMap(
  (category) => category.departments
);

/**
 * List of all category names
 */
export const CATEGORY_NAMES: string[] = DEPARTMENT_CATEGORIES.map(
  (category) => category.value
);

/**
 * Get departments by category
 */
export const getDepartmentsByCategory = (categoryValue: string): Department[] => {
  const category = DEPARTMENT_CATEGORIES.find((cat) => cat.value === categoryValue);
  return category ? category.departments : [];
};

/**
 * Get category for a specific department
 */
export const getCategoryForDepartment = (departmentValue: string): string | null => {
  for (const category of DEPARTMENT_CATEGORIES) {
    if (category.departments.some((dept) => dept.value === departmentValue)) {
      return category.value;
    }
  }
  return null;
};

/**
 * Check if a department exists
 */
export const isDepartmentValid = (departmentValue: string): boolean => {
  return ALL_DEPARTMENTS.some((dept) => dept.value === departmentValue);
};
