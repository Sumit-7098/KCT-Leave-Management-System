import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export async function fetchEmployees() {
  const res = await api.get("/employees");
  return res.data; // { employees: [...] }
}

export async function updateEmployee(employeeId, payload) {
  const res = await api.patch(`/employee-management/${employeeId}`, payload);
  return res.data;
}

export async function deleteEmployee(employeeId) {
  const res = await api.delete(`/employee-management/${employeeId}`);
  return res.data;
}

export async function createEmployee(payload) {
  const res = await api.post(`/employee-management/`, payload);
  return res.data;
}


