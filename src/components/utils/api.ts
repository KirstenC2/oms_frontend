import axios from 'axios'

export const createUser = (data: Record<string, any>) =>
  axios.post('http://localhost:5001/users', data)

export const createRole = (data: Record<string, any>) =>
  axios.post('http://localhost:5001/roles', data)

export const createDepartment = (data: Record<string, any>) =>
  axios.post('http://localhost:5001/departments', data)

export const fetchDepartments = () => axios.get('http://localhost:5001/departments')
export const fetchRoles = () => axios.get('http://localhost:5001/roles')
export const fetchUsers = () => axios.get('http://localhost:5001/users')

export const deleteDepartment = (id: string) =>
  axios.delete(`http://localhost:5001/departments/${id}`)

export const deleteRole = (id: string) =>
  axios.delete(`http://localhost:5001/roles/${id}`)

export const deleteUser = (id: string) =>
  axios.delete(`http://localhost:5001/users/${id}`) 

export const deactiveUser = (id: string) =>
  axios.patch(`http://localhost:5001/users/${id}/deactivate`) 

export const activateUser = (id: string) =>
  axios.patch(`http://localhost:5001/users/${id}/activate`)