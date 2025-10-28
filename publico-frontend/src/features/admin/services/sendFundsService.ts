import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  projectId?: string;
  phaseNumber?: number;
  milestoneId?: string;
}

export const sendFunds = async ({ projectId, phaseNumber, milestoneId }: Props) => {
  const token = localStorage.getItem("publico_auth_token");
  const privateKey = localStorage.getItem("publico_user_data");

  if (!privateKey) {
    console.log("No private key found");
    return;
  }

  try {
    const json = JSON.parse(privateKey);
    
    if (!json?.user?.privateKey) {
      toast.error("Invalid user data");
      return;
    }
    const response = await fetch(
      "http://localhost:5000/admin/transaction/create_transaction",
      {
        method:"POST",
        headers: {
          
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({
            privateKey:json.user.privateKey,
            projectId:projectId,
            phaseNumber: 1
        })
      }
    );
    const toJson = await response.json();
    if (!response.ok) {
        console.log(toJson.message);
        if (toJson.message.toString().toLowerCase() == "Transaction has been reverted by the EVM".toLowerCase()) {
          toast.error("Insufficient funds.")
        }else{
          toast.error(toJson.message)
        }
    }else{
        toast.success("Funded successfuly!")
    }
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      toast.error("Invalid user data format");
    } else {
      toast.error("Insufficient funds.")
    }
    console.error("Error sending funds:", error.response?.message || error.message);
  }
};


export const approveBudget = async ({ projectId }: Props) => {
  const token = localStorage.getItem("publico_auth_token");
  const privateKey = localStorage.getItem("publico_user_data");

  if (!privateKey) {
    console.log("No private key found");
    return;
  }

  try {
    const json = JSON.parse(privateKey);
    
    if (!json?.user?.user_id) {
      toast.error("Invalid user data");
      return;
    }
    const response = await fetch(
      "http://localhost:5000/admin/transaction/approve",
      {
        method:"POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({
            projectId:projectId,
            admin_id: json.user.user_id,
        })
      }
    );
    const toJson = await response.json();
    if (!response.ok) {
        console.log(toJson.message);
        toast.error(toJson.message)
    }else{
        toast.success("Approved successfuly!")
    }
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      toast.error("Invalid user data format");
    } else {
      toast.error(error.message || "Failed to approve budget")
    }
    console.error("Error approving budget:", error.response?.message || error.message);
  }
};


export const rejectBudget = async ({ projectId }: Props) => {
  const token = localStorage.getItem("publico_auth_token");
  const privateKey = localStorage.getItem("publico_user_data");

  if (!privateKey) {
    console.log("No private key found");
    return;
  }

  try {
    const json = JSON.parse(privateKey);
    
    if (!json?.user?.user_id) {
      toast.error("Invalid user data");
      return;
    }
    const response = await fetch(
      "http://localhost:5000/admin/transaction/reject",
      {
        method:"POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify({
            projectId:projectId,
            admin_id: json.user.user_id,
        })
      }
    );
    const toJson = await response.json();
    if (!response.ok) {
        console.log(toJson.message);
        toast.error(toJson.message)
    }else{
        toast.success("Rejected successfuly!")
    }
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      toast.error("Invalid user data format");
    } else {
      toast.error(error.message || "Failed to approve budget")
    }
    console.error("Error approving budget:", error.response?.message || error.message);
  }
};
