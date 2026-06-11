import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { getAllEmployees } from "../Controller/employee.controller.js";

const employeeRouter = Router();

// Admin-only employee listing (simple approach: any authenticated admin)
employeeRouter.get("/", verifyToken, getAllEmployees);

export default employeeRouter;

