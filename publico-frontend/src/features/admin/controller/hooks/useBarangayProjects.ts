import { useState, useEffect } from 'react';
import { DAGUPAN_BARANGAYS, type BarangayProject } from '../../model/types/map';
import { BarangayMapService } from '../../services/barangayMapService';

export const useBarangayProjects = () => {
  const [barangays, setBarangays] = useState<BarangayProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarangay, setSelectedBarangay] = useState<BarangayProject | null>(null);

  useEffect(() => {
    const fetchBarangayData = async () => {
      try {
        // Try to fetch from backend first
        // const response = await BarangayMapService.getBarangayProjects();
        // setBarangays(response);
        
        // For now, use static data (will automatically switch when backend is ready)
        setBarangays(DAGUPAN_BARANGAYS);
      } catch (error) {
        console.error('Error fetching barangay projects:', error);
        // Fallback to static data if API fails
        setBarangays(DAGUPAN_BARANGAYS);
      } finally {
        setLoading(false);
      }
    };

    fetchBarangayData();
  }, []);

  const selectBarangay = (barangayId: string | null) => {
    if (!barangayId) {
      setSelectedBarangay(null);
      return;
    }
    const barangay = barangays.find(b => b.id === barangayId);
    setSelectedBarangay(barangay || null);
  };

  const getTotalProjects = () => {
    return barangays.reduce((sum, b) => sum + b.projectCount, 0);
  };

  const getTotalBudget = () => {
    return barangays.reduce((sum, b) => {
      const barangayBudget = b.projects.reduce((pSum, p) => pSum + p.budget, 0);
      return sum + barangayBudget;
    }, 0);
  };

  return {
    barangays,
    loading,
    selectedBarangay,
    selectBarangay,
    getTotalProjects,
    getTotalBudget
  };
};
