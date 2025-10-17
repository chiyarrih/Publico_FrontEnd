import { useState, useRef } from "react";
import { connect, Socket } from "socket.io-client";
import { fetchUsers } from "@agency/services/agencyService";
import useWallet from "../../../../shared/hooks/useWallet";
import { UseData } from "@/interfaces/user";

export default function useConnectWallet() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [fetchedData, setFetchedData] = useState<UseData>();
  const socketRef = useRef<Socket | null>(null);
  const token = localStorage.getItem('publico_auth_token');

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleProfileUpdate = (profileData: any) => {
    setProfile(profileData);
  };

  const handleFetchedData = (data: any) => {
    setFetchedData(data);
  };

  const walletHook = useWallet({ 
    role: 'Agency', 
    onProfileUpdate: handleProfileUpdate,
    onFetchedData: handleFetchedData
  });

  return {
    isEditing,
    setIsEditing,
    profile,
    setProfile,
    fetchedData,
    handleSave,
    ...walletHook,
  };
}
