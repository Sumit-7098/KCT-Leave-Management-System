import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { getAllLeaveRequests, updateLeaveStatus } from "../Controller/leaveAdmin.controller.js";

const leaveAdminRouter = Router();

// Admin: list all leave requests
leaveAdminRouter.get("/requests", verifyToken, getAllLeaveRequests);

// Admin: update status
leaveAdminRouter.patch("/requests/:id/approve", verifyToken, updateLeaveStatus);
leaveAdminRouter.patch("/requests/:id/reject", verifyToken, updateLeaveStatus);

export default leaveAdminRouter;

