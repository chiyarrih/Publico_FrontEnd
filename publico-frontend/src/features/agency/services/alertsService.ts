

export async function getAlertsByAgency(): Promise<any> {
    const  privateKey = localStorage.getItem("publico_user_data");

    if (!privateKey) {
        console.log("No private key found");
        return;
    }

    const toJson = JSON.parse(privateKey);
    try {
        const response = await fetch(`http://localhost:5000/smart/contract/alert/${toJson.user.agency_web3_account.address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('publico_auth_token')}`,
          'Accept': 'application/json'
        },
      });
      const json = await response.json();
      if (!response.ok) {
        console.error(json);
        throw new Error(json.message || json.error );
      }
      return json.data;
    } catch (error) {
        console.error("Error fetching smart contract alerts:", error);
    }
}