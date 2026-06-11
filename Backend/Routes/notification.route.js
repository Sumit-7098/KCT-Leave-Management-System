import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getAdminNotifications,
  markAdminNotificationsAsRead,
} from "../Controller/notification.controller.js";

const router = Router();

router.get("/admin", verifyToken, getAdminNotifications);
router.post("/admin/mark-read", verifyToken, markAdminNotificationsAsRead);

export default router;

