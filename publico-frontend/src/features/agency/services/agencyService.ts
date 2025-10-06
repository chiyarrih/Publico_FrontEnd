import { BudgetFormProps } from 'interfaces/budget';
import { apiClient } from '../../../config/api';
import { decrypt } from '../../../utils/encryptor';
import { io } from 'socket.io-client';
import axios from 'axios'
export interface BudgetProject {
  _id?: string;
  projectName: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: string;
}

export const sendBudgetProposal = async (data: BudgetFormProps, files: File[]) => {
  const token = localStorage.getItem('publico_auth_token');
  const localData = localStorage.getItem('publico_user_data');
  if (!localData) throw new Error("No user data in localStorage");

  const jsonparse = JSON.parse(localData);

  const formData = new FormData();

  formData.append("agencyId", jsonparse.user.user_id);
  formData.append("address", jsonparse.user.address);
  formData.append("privateKey", jsonparse.user.privateKey);
  formData.append("timeline", `${data.startDate} - ${data.endDate}`);
  formData.append("projectName", data.projectName);
  formData.append("department", data.department);
  formData.append("category", data.category);
  formData.append("amountRequested", data.amountRequested);
  formData.append("startDate", data.startDate);
  formData.append("message", data?.objectives)
  formData.append("endDate", data.endDate);

  files.forEach((file) => formData.append("fileUrl", file));

  const response = await fetch('http://localhost:5000/agency/budget/create_budget_proposal', {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await response.json();
  if (!response.ok) {
    console.error(json);
    throw new Error(json.message || "Failed to submit proposal");
  }

  return json;
};


export const fetchProjectsProposed = async (page = 1, limit = 10) => {
  const id = localStorage.getItem('publico_user_data');
  if (!id) throw new Error("No user data found");

  const parse = JSON.parse(id);
  const response = await fetch(
    `http://localhost:5000/agency/projects/${parse.user.user_id}?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parse.user.token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Error fetching projects");
  }
  return json;
};


export const updateToConnected = async () => {
  const email =  localStorage.getItem('publico_user_data');
  if (!email) throw new Error("No user data found");
  const parse = JSON.parse(email);
  const response = await fetch(
    `http://localhost:5000/admin/auth/management/update`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${parse.user.token}`,
        "Content-Type": "application/json",
      },
      body:JSON.stringify({email:parse.email})
    }
  );

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Error fetching projects");
  }
  console.log(json);
  
  return json;
}

export const fetchUsers = async () => {
  const email =  localStorage.getItem('publico_user_data');
  if (!email) throw new Error("No user data found");
  const parse = JSON.parse(email);
  const response = await fetch(`http://localhost:5000/admin/auth/management/fetch/${parse.email}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parse.user.token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Error fetching projects");
  }
  
  return json;
}


export const fetchLedger = async (page:number, limit:number) => {
  try {
    const storage = localStorage.getItem('publico_user_data')
    if (!storage) throw new Error("Not found")
    const json = JSON.parse(storage)

    const response = await axios.get(`http://localhost:5000/api/ledgers/${json.user.user_id}?page=${page}&limit=${limit}`, 
      {
        headers:{
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${json.user.token}`
        },
        params: {page, limit}
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching ledger:", error);
    throw error;

  }
}


