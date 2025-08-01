// middleware/avatarUpload.middleware.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "df7qeco5q",
  api_key: "515784736427818",
  api_secret: "r9RgQWX8ItQWK4XGvI71JHx15bw",
  
});

cloudinary.api.ping((err, res) => {
  console.log("Cloudinary Ping:", err || res);
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
    resource_type: "image",
    public_id: (req, file) => `avatar-${Date.now()}-${file.originalname}`,
  },
});

export const avatarUpload = multer({ storage });
