import express from "express";
import {
  updateUser,
  test,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { getUserUploads } from "../controllers/user.controller.js";
import { avatarUpload } from "../utils/avatarUpload.middleware.js";

const router = express.Router();

router.get("/test", test);
router.post(
  "/update/:id",
  verifyToken,
  (req, res, next) => {
    avatarUpload.single("avatar")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  updateUser
);

router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/uploads/:id", verifyToken, getUserUploads);

export default router;
