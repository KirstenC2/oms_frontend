import axios from 'axios'

export const fetchAllProjects = () => 
    axios.get('http://localhost:5001/projects')

export const fetchProjectsByID = (id: string) =>
    axios.get(`http://localhost:5001/projects/${id}`)

export const deleteProjectByID = (id: string) =>
    axios.delete(`http://localhost:5001/projects/${id}`)

export const createProject = (data: Record<string, any>) =>
    axios.post('http://localhost:5001/projects', data)