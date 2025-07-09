import axios from 'axios'

export const createTask = (data: Record<string, any>) =>
    axios.post(`http://localhost:5001/projects/${data.projectId}/tasks`, data)