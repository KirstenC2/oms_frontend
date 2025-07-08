import axios from 'axios'

export const createRole = (data: Record<string, any>) =>
  axios.post('http://localhost:5001/roles', data)

export const fetchRoles = () => axios.get('http://localhost:5001/roles')

export const deleteRole = (id: string) =>
  axios.delete(`http://localhost:5001/roles/${id}`)
