export const decrypt = async ({privateKey}: {privateKey:string}) => {
  const response = await fetch("http://localhost:5000/api/decrypt/private", {
      method: "POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({privateKey: privateKey})
    })
    const json = await response.json()
    if (!response.ok) {
      console.log(json);
    }
    const decrypted = await json.decryptedKey;
    return decrypted
} 