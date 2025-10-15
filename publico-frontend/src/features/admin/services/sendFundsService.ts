import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  projectId?: string;
}

export const sendFunds = async ({ projectId }: Props) => {
  const token = localStorage.getItem("publico_auth_token");
  const privateKey = localStorage.getItem("publico_user_data");

  if (!privateKey) {
    console.log("No private key found");
    return;
  }

  const json = JSON.parse(privateKey);

  try {
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
            projectId:projectId
        })
      }
    );
    const toJson = await response.json();
    if (!response.ok) {
        console.log(toJson.message);
        toast.error("Insufficient funds.")
    }else{
        toast.success("Funded successfuly!")
    }
  } catch (error: any) {
    toast.error("Insufficient funds.")
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
            projectId:projectId
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
    toast.error("Insufficient funds.")
    console.error("Error sending funds:", error.response?.message || error.message);
  }
};
