import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DepartmentFilterContextType {
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  availableDepartments: string[];
  setAvailableDepartments: (depts: string[]) => void;
  selectedView: string;
  setSelectedView: (view: string) => void;
}

const DepartmentFilterContext = createContext<DepartmentFilterContextType | undefined>(undefined);

export const DepartmentFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  const [selectedView, setSelectedView] = useState('Monthly View');

  return (
    <DepartmentFilterContext.Provider value={{ 
      selectedDepartment, 
      setSelectedDepartment, 
      availableDepartments, 
      setAvailableDepartments,
      selectedView,
      setSelectedView
    }}>
      {children}
    </DepartmentFilterContext.Provider>
  );
};

export const useDepartmentFilter = () => {
  const context = useContext(DepartmentFilterContext);
  if (!context) {
    throw new Error('useDepartmentFilter must be used within DepartmentFilterProvider');
  }
  return context;
};

