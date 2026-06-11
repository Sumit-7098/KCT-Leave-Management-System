import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { createLeave, getMyLeaves } from "../Controller/leave.controller.js";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";

// Use memory storage so controller can upload to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and images allowed"), false);
    }
  }
});

const leaveRouter = Router();

leaveRouter.get("/my-leaves", verifyToken, getMyLeaves);
leaveRouter.post("/apply", verifyToken, upload.single("document"), async (req, res, next) => {
  try {
    if (req.file) {
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return res.status(500).json({ message: "Cloudinary is not configured on server" });
      }

      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          dataUri,
          {
            folder: "kct-leave-management/documents",
            resource_type: "auto",
            transformation: req.file.mimetype.startsWith("image/") ? [{ quality: "auto:best" }] : undefined
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
      });

      // Put Cloudinary URL in req.file so existing controller can keep using req.file.document path/name
      req.file.path = uploadRes.secure_url;
    }

    return createLeave(req, res, next);
  } catch (error) {
    console.error("Cloudinary leave document upload error:", error);
    return res.status(500).json({ message: "Failed to upload document" });
  }
});

export default leaveRouter;

