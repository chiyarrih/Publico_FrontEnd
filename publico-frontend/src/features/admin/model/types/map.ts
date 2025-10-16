export interface BarangayProject {
  id: string;
  barangay: string;
  projectCount: number;
  lat: number;
  lng: number;
  projects: ProjectDetail[];
}

export interface ProjectDetail {
  id: string;
  name: string;
  department: string;
  budget: number;
  status: 'Active' | 'Pending' | 'Completed';
}

export interface MapCenter {
  lat: number;
  lng: number;
}

// Dagupan City center coordinates
export const DAGUPAN_CITY_CENTER: MapCenter = {
  lat: 16.0433,
  lng: 120.3334
};

// Barangay coordinates for Dagupan City, Pangasinan
export const DAGUPAN_BARANGAYS: BarangayProject[] = [
  {
    id: 'brgy-1',
    barangay: 'Bonuan Gueset',
    projectCount: 5,
    lat: 16.0167,
    lng: 120.3333,
    projects: [
      { id: 'PRJ-001', name: 'Road Rehabilitation', department: 'Public Works', budget: 2500000, status: 'Active' },
      { id: 'PRJ-002', name: 'Drainage System', department: 'Public Works', budget: 1800000, status: 'Active' },
      { id: 'PRJ-003', name: 'Health Center Upgrade', department: 'Health', budget: 950000, status: 'Pending' },
      { id: 'PRJ-004', name: 'Street Lighting', department: 'Public Works', budget: 650000, status: 'Completed' },
      { id: 'PRJ-005', name: 'Coastal Cleanup', department: 'Environment', budget: 320000, status: 'Active' }
    ]
  },
  {
    id: 'brgy-2',
    barangay: 'Bonuan Boquig',
    projectCount: 3,
    lat: 16.0267,
    lng: 120.3267,
    projects: [
      { id: 'PRJ-006', name: 'Market Development', department: 'Public Works', budget: 3200000, status: 'Active' },
      { id: 'PRJ-007', name: 'Fish Port Upgrade', department: 'Agriculture', budget: 1500000, status: 'Active' },
      { id: 'PRJ-008', name: 'Basketball Court', department: 'Sports', budget: 450000, status: 'Pending' }
    ]
  },
  {
    id: 'brgy-3',
    barangay: 'Calmay',
    projectCount: 4,
    lat: 16.0567,
    lng: 120.3433,
    projects: [
      { id: 'PRJ-009', name: 'School Building Repair', department: 'Education', budget: 2800000, status: 'Active' },
      { id: 'PRJ-010', name: 'Water Supply System', department: 'Public Works', budget: 1900000, status: 'Active' },
      { id: 'PRJ-011', name: 'Barangay Hall Renovation', department: 'Public Works', budget: 850000, status: 'Pending' },
      { id: 'PRJ-012', name: 'Multi-purpose Hall', department: 'Public Works', budget: 1200000, status: 'Active' }
    ]
  },
  {
    id: 'brgy-4',
    barangay: 'Carael',
    projectCount: 2,
    lat: 16.0400,
    lng: 120.3567,
    projects: [
      { id: 'PRJ-013', name: 'Irrigation System', department: 'Agriculture', budget: 2100000, status: 'Active' },
      { id: 'PRJ-014', name: 'Farm-to-Market Road', department: 'Public Works', budget: 1750000, status: 'Pending' }
    ]
  },
  {
    id: 'brgy-5',
    barangay: 'Pantal',
    projectCount: 6,
    lat: 16.0533,
    lng: 120.3267,
    projects: [
      { id: 'PRJ-015', name: 'Medical Equipment', department: 'Health', budget: 1800000, status: 'Active' },
      { id: 'PRJ-016', name: 'Daycare Center', department: 'Education', budget: 980000, status: 'Active' },
      { id: 'PRJ-017', name: 'Barangay Road Paving', department: 'Public Works', budget: 3500000, status: 'Active' },
      { id: 'PRJ-018', name: 'Street Lights Installation', department: 'Public Works', budget: 720000, status: 'Pending' },
      { id: 'PRJ-019', name: 'Community Center', department: 'Public Works', budget: 1600000, status: 'Active' },
      { id: 'PRJ-020', name: 'Sports Equipment', department: 'Sports', budget: 350000, status: 'Completed' }
    ]
  },
  {
    id: 'brgy-6',
    barangay: 'Lucao',
    projectCount: 3,
    lat: 16.0467,
    lng: 120.3367,
    projects: [
      { id: 'PRJ-021', name: 'Flood Control', department: 'Public Works', budget: 4200000, status: 'Active' },
      { id: 'PRJ-022', name: 'Bridge Construction', department: 'Public Works', budget: 5500000, status: 'Active' },
      { id: 'PRJ-023', name: 'Environmental Program', department: 'Environment', budget: 680000, status: 'Pending' }
    ]
  },
  {
    id: 'brgy-7',
    barangay: 'Poblacion',
    projectCount: 7,
    lat: 16.0433,
    lng: 120.3334,
    projects: [
      { id: 'PRJ-024', name: 'City Hall Renovation', department: 'Public Works', budget: 8500000, status: 'Active' },
      { id: 'PRJ-025', name: 'Traffic Management System', department: 'Public Works', budget: 2300000, status: 'Active' },
      { id: 'PRJ-026', name: 'Public Market Modernization', department: 'Public Works', budget: 6700000, status: 'Active' },
      { id: 'PRJ-027', name: 'Bangus Festival Preparation', department: 'Tourism', budget: 950000, status: 'Pending' },
      { id: 'PRJ-028', name: 'CCTV Installation', department: 'Public Safety', budget: 1800000, status: 'Active' },
      { id: 'PRJ-029', name: 'Park Development', department: 'Public Works', budget: 1250000, status: 'Active' },
      { id: 'PRJ-030', name: 'LED Streetlights', department: 'Public Works', budget: 980000, status: 'Completed' }
    ]
  },
  {
    id: 'brgy-8',
    barangay: 'Tapuac',
    projectCount: 4,
    lat: 16.0300,
    lng: 120.3467,
    projects: [
      { id: 'PRJ-031', name: 'Beach Development', department: 'Tourism', budget: 2800000, status: 'Active' },
      { id: 'PRJ-032', name: 'Eco-Park Project', department: 'Environment', budget: 1900000, status: 'Active' },
      { id: 'PRJ-033', name: 'Coastal Road Improvement', department: 'Public Works', budget: 3600000, status: 'Pending' },
      { id: 'PRJ-034', name: 'Water Sports Facility', department: 'Sports', budget: 1200000, status: 'Active' }
    ]
  }
];
