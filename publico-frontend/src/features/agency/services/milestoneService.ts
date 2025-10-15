import toast from "react-hot-toast";

export async function getProjectMilestoneAsAgency(){
    const token = await localStorage.getItem('publico_auth_token')
    const user = await localStorage.getItem('publico_user_data')
    if (!token) throw new Error("Token not found");
    if (!user) throw new Error("User not found");
    const toJson = await JSON.parse(user)
    try {
        const response = await fetch(`http://localhost:5000/milestone/agency/projects/${toJson.user.user_id}`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Authorization':`Bearer ${token}`
            },
        })
        const json = await response.json();
        if (!response.ok) {
            console.log(json.message);
        };
        
        return json;
    } catch (error) {
        console.log(error);
        
    }
}

export async function getProjectMilestoneAsAgencyById({_id}:{_id:string}){
    const token = await localStorage.getItem('publico_auth_token')
    const user = await localStorage.getItem('publico_user_data')
    if (!token) throw new Error("Token not found");
    if (!user) throw new Error("User not found");
    try {
        const response = await fetch(`http://localhost:5000/milestone/${_id}`, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Authorization':`Bearer ${token}`
            },
        })
        const json = await response.json();
        if (!response.ok) {
            console.log(json.message);
        };
        
        return json;
    } catch (error) {
        console.log(error);
        
    }
}