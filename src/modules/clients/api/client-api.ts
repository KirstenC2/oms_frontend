import axios from "axios";

export const fetchClients = () =>
  axios.get('http://localhost:5001/clients')

export const removeClients = (id: string) =>
    axios.delete(`http://localhost:5001/clients/${id}`)

export const createClient = (data: Record<string, any>) =>
  axios.post('http://localhost:5001/clients', data)