import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { getEmployeeLeaveBalances } from "../Controller/leaveBalanceAdmin.controller.js";

const leaveBalanceAdminRouter = Router();

// Admin: list leave balances for all employees
leaveBalanceAdminRouter.get("/balances", verifyToken, getEmployeeLeaveBalances);

export default leaveBalanceAdminRouter;

