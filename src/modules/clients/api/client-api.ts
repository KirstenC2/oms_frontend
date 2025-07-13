import axios from "axios";

export const fetchClients = () =>
  axios.get('http://localhost:5001/clients')