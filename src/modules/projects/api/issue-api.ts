import axios from 'axios';

export const updateIssueStatus = (issueId: string, newStatus: string) => {
    console.log(`Updating issue with ID ${issueId} to new status: ${newStatus}`);
    return axios.put(`http://localhost:5001/issues/${issueId}/status`, { newStatus });
}

export const createIssue = async (issueData: {
    title: string;
    description?: string;
    status: string;
    priority: string;
    projectId: string;
}) => {
    try {
        const response = await axios.post('http://localhost:5001/issues', issueData);
        return response.data; // Return the created issue data
    } catch (error) {
        console.error('Error creating issue:', error);
        throw error; // Re-throw the error for handling in the calling component
    }
};