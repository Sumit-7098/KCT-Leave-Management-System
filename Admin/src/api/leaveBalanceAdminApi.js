import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Admin: get all employee leave balances.
// Note: backend currently does not implement this route; it will be added
// as part of this change.
export async function fetchLeaveBalances() {
  const res = await api.get("/leave/balances");
  return res.data; // { balances: [...] }
}

