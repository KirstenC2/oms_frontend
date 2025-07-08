import axios from "axios";

export const createUser = (data: Record<string, any>) =>
  axios.post('http://localhost:5001/users', data)


export const deleteUser = (id: string) =>
  axios.delete(`http://localhost:5001/users/${id}`) 

export const deactiveUser = (id: string) =>
  axios.patch(`http://localhost:5001/users/${id}/deactivate`) 

export const activateUser = (id: string) =>
  axios.patch(`http://localhost:5001/users/${id}/activate`)

export const fetchUsers = () => axios.get('http://localhost:5001/users')
