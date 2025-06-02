import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from 'cloudinary';
import c from "config";


cloudinary.config({
  cloud_name: c.get("Cloudinary.servername"),
  api_key: c.get("Cloudinary.api_key"),
  api_secret: c.get("Cloudinary.api_secret"),
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "users",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

export const upload = multer({ storage });
