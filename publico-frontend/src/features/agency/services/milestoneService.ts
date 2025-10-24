import toast from "react-hot-toast";
import { apiClient } from "../../../config/api";

export async function getProjectMilestoneAsAgency(){
    const user = await localStorage.getItem('publico_user_data')
    if (!user) throw new Error("User not found");
    const toJson = await JSON.parse(user)
    try {
        // Use _id instead of user_id as per the backend User model
        const userId = toJson.user._id || toJson.user.user_id;
        console.log('Fetching milestones for user ID:', userId);
        
        const json = await apiClient.get(`/milestone/agency/projects/${userId}`);
        console.log('Milestone API response:', json);
        
        // Return empty array if no milestones found
        return Array.isArray(json) ? json : [];
    } catch (error) {
        console.error('Error fetching milestones:', error);
        // Return empty array instead of throwing error for 404 cases
        if (error.message?.includes('Project milestone not found')) {
            return [];
        }
        throw error;
    }
}

export async function getProjectMilestoneAsAgencyById({_id}:{_id:string}){
    try {
        console.log('Fetching milestone by ID:', _id);
        
        const json = await apiClient.get(`/milestone/${_id}`);
        console.log('Milestone by ID API response:', json);
        
        return json;
    } catch (error) {
        console.error('Error fetching milestone:', error);
        throw error;
    }
}