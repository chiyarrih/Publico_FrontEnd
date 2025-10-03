import { BudgetFormProps } from 'interfaces/budget';
import { apiClient } from '../../../config/api';
import { decrypt } from '../../../utils/encryptor';
import { io } from 'socket.io-client';

export interface BudgetProject {
  _id?: string;
  projectName: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: string;
}

export const sendBudgetProposal  = async (data: BudgetFormProps) => {
  const token = localStorage.getItem('publico_auth_token')
  const localData = localStorage.getItem('publico_user_data')
  if (!localData) throw new Error("No user data in localStorage");

  const jsonparse = JSON.parse(localData)
  
  const response = await fetch('http://localhost:5000/agency/budget/create_budget_proposal', {
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${token}`
    },
    method:"POST",
    credentials:"include",
    body:JSON.stringify({
      agencyId: jsonparse.user.user_id,
      address: jsonparse.user.address,
      privateKey: jsonparse.user.privateKey,
      timeline: `${data.startDate} - ${data.endDate}`,
      ...data
    })
  })
  const json = await response.json()
  if (!response.ok) {
    console.log(json);
  }else{
    console.log(json);
    return json
  }
}


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
  io
  
  return json;
}