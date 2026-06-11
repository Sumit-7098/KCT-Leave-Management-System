import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export async function fetchLeaveRequests() {
  const res = await api.get("/leave/requests");
  return res.data; // { leaves: [...] }
}

export async function approveLeaveRequest(requestId) {
  const res = await api.patch(`/leave/requests/${requestId}/approve`);
  return res.data;
}

export async function rejectLeaveRequest(requestId, payload = {}) {
  const res = await api.patch(`/leave/requests/${requestId}/reject`, payload);
  return res.data;
}

