import axios from "axios";

export const fetchLeaveRequests = () =>
  axios.get('http://localhost:5001/leave-requests')

export const createLeaveRequest = (data: Record<string, any>) =>
  axios.post('http://localhost:5001/leave-requests', data)


export const cancelLeaveRequest = (id: string) =>
  axios.patch(`http://localhost:5001/leave-requests/${id}/cancel`)

export const fetchLeaveRequestsByID = (requestId: string) =>
  axios.get(`http://localhost:5001/leave-requests/${requestId}/details`)

export const approveLeaveRequest = (id: string) =>
  axios.patch(`http://localhost:5001/leave-requests/${id}/approve`)

export const rejectLeaveRequest = (id: string) =>
  axios.patch(`http://localhost:5001/leave-requests/${id}/reject`)  