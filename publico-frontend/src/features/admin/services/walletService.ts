export const updateAdminToConnected = async () => {
  const userData = localStorage.getItem('publico_user_data');
  if (!userData) throw new Error("No user data found");
  
  const parse = JSON.parse(userData);
  const response = await fetch(
    `http://localhost:5000/admin/auth/management/update`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${parse.user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: parse.email })
    }
  );

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Error updating connection status");
  }
  
  return json;
};

export const fetchAdminUser = async () => {
  const userData = localStorage.getItem('publico_user_data');
  if (!userData) throw new Error("No user data found");
  
  const parse = JSON.parse(userData);
  const response = await fetch(
    `http://localhost:5000/admin/auth/management/fetch/${parse.email}`,
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
    throw new Error(json.message || "Error fetching user data");
  }
  
  return json;
};

export const connectWalletToBackend = async (address: string, signature: string, message: string) => {
  const response = await fetch("http://localhost:5000/api/wallet/connect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, signature, message }),
  });
  
  return response;
};

export const decryptPrivateKey = async (privateKey: string) => {
  const response = await fetch("http://localhost:5000/api/decrypt/private", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ privateKey })
  });
  
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Error decrypting private key");
  }
  
  return json.decryptedKey;
};

