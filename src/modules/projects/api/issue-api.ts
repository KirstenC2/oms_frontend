import axios from 'axios';

export const updateIssueStatus = (issueId: string, newStatus: string) => {
    console.log(`Updating issue with ID ${issueId} to new status: ${newStatus}`);
    return axios.put(`http://localhost:5001/issues/${issueId}/status`, { newStatus });
}