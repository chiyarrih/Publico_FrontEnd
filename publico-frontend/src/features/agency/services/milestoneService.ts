import toast from "react-hot-toast";
import { apiClient } from "../../../config/api";

export async function getProjectMilestoneAsAgency(){
    const user = await localStorage.getItem('publico_user_data')
    if (!user) throw new Error("User not found");
    const toJson = await JSON.parse(user)
    try {
        // Use agencyId from user data - this should match the backend expectation
        const agencyId = toJson.user._id; // The user's _id is used as agencyId in the backend
        console.log('Fetching milestones for agency ID:', agencyId);
        
        const json = await apiClient.get(`/milestone/agency/projects/${agencyId}`);
        console.log('Milestone API response:', json);
        
        // Return empty array if no milestones found
        return Array.isArray(json) ? json : [];
    } catch (error) {
        console.error('Error fetching milestones:', error);
        // Only return empty array for 404 cases, throw other errors
        if ((error as any)?.response?.status === 404 || (error as any)?.message?.includes('Project milestone not found')) {
            console.log('No milestones found for this agency');
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