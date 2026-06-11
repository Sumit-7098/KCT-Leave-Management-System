import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  createEmployee,
} from "../Controller/employee.controller.js";

const employeeManagementRouter = Router();

employeeManagementRouter.get("/", verifyToken, getAllEmployees);
employeeManagementRouter.post("/", verifyToken, createEmployee);
employeeManagementRouter.patch("/:id", verifyToken, updateEmployee);
employeeManagementRouter.delete("/:id", verifyToken, deleteEmployee);

export default employeeManagementRouter;

