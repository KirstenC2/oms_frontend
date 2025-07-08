import axios from 'axios'

export const createDepartment = (data: Record<string, any>) =>
  axios.post('http://localhost:5001/departments', data)

export const fetchDepartments = () => axios.get('http://localhost:5001/departments')

export const deleteDepartment = (id: string) =>
  axios.delete(`http://localhost:5001/departments/${id}`)

