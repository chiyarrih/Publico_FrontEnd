export type PhaseName = "planning"|"procurement"|"construction"|"completion";

export interface Phase {
  budget: number;   // how much was planned
  spent: number;    // how much was used
  progress: number; // 0–100
  status: "Completed"|"In Progress"|"Pending";
  start: string;
  end: string;
}
export interface Proof {
  id: string;
  phase: PhaseName;
  title: string;
  note: string;
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  checkStatus: "Verified"|"Pending Verification";
}
export interface Project {
  id: string;
  title: string;
  department: string;
  totalBudget: number;
  timeline: { start: string; end: string };
  status: "In Progress" | "Pending" | "Completed";
  phases: Record<PhaseName, Phase>;
  proofs?: Proof[];
}

export const asMoney = (n:number) => `₱${n.toLocaleString()}`;

// simple sample data to render the screens
export const sampleProjects: Project[] = [
  {
    id:"PRJ-2023-0125",
    title:"Road Rehabilitation – Perez Blvd",
    department:"Public Works",
    totalBudget: 2_500_000,
    timeline:{ start:"Jun 1, 2023", end:"Aug 30, 2023" },
    status:"In Progress",
    phases:{
      planning:{ budget:300_000, spent:280_000, progress:100, status:"Completed", start:"Jun 1, 2023", end:"Jun 15, 2023" },
      procurement:{ budget:800_000, spent:950_000, progress:75, status:"In Progress", start:"Jun 16, 2023", end:"Jul 15, 2023" },
      construction:{ budget:1_200_000, spent:0, progress:9, status:"Pending", start:"Jul 16, 2023", end:"Aug 15, 2023" },
      completion:{ budget:200_000, spent:0, progress:5, status:"Pending", start:"Aug 16, 2023", end:"Aug 30, 2023" },
    },
    proofs:[
      { id:"p1", phase:"procurement", title:"Material Purchase Receipts", note:"Official receipts for all materials", size:"2.8 MB", uploadedBy:"Procurement Officer", uploadedDate:"2023-06-25", checkStatus:"Verified" },
      { id:"p2", phase:"procurement", title:"Equipment Rental Agreement", note:"Signed contract with terms", size:"1.5 MB", uploadedBy:"Procurement Officer", uploadedDate:"2023-07-06", checkStatus:"Pending Verification" },
    ]
  },
  {
    id:"PRJ-2023-0126",
    title:"Public School Renovation – Central Elementary",
    department:"Education",
    totalBudget:1_800_000,
    timeline:{ start:"May 18, 2023", end:"Jul 30, 2023" },
    status:"In Progress",
    phases:{
      planning:{ budget:250_000, spent:250_000, progress:100, status:"Completed", start:"May 18, 2023", end:"May 25, 2023" },
      procurement:{ budget:600_000, spent:400_000, progress:60, status:"In Progress", start:"May 26, 2023", end:"Jun 25, 2023" },
      construction:{ budget:800_000, spent:200_000, progress:25, status:"In Progress", start:"Jun 26, 2023", end:"Jul 28, 2023" },
      completion:{ budget:150_000, spent:0, progress:0, status:"Pending", start:"Jul 29, 2023", end:"Jul 30, 2023" },
    }
  },
  {
    id:"PRJ-2023-0127",
    title:"Medical Equipment Procurement – City Hospital",
    department:"Health",
    totalBudget:3_200_000,
    timeline:{ start:"Jun 10, 2023", end:"Sep 10, 2023" },
    status:"In Progress",
    phases:{
      planning:{ budget:300_000, spent:300_000, progress:100, status:"Completed", start:"Jun 10, 2023", end:"Jun 18, 2023" },
      procurement:{ budget:1_400_000, spent:900_000, progress:60, status:"In Progress", start:"Jun 19, 2023", end:"Aug 10, 2023" },
      construction:{ budget:1_200_000, spent:100_000, progress:10, status:"Pending", start:"Aug 11, 2023", end:"Sep 5, 2023" },
      completion:{ budget:300_000, spent:0, progress:0, status:"Pending", start:"Sep 6, 2023", end:"Sep 10, 2023" },
    }
  }
];
