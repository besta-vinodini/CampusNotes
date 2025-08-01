// utils/multer.js
import multer from "multer";
import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { updateUser } from "../controllers/user.controller.js";

const router = express.Router();

const storage = multer.memoryStorage(); // Store file in memory buffer

const upload = multer({ storage });

router.post("/update/:id",verifyToken,upload.single("avatar"),updateUser);
export default upload;
