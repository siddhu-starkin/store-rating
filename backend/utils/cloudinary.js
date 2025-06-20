// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadBase64ToCloudinary = async (base64, mimeType, folder) => {
  const fileStr = `data:${mimeType};base64,${base64}`;

  const res = await cloudinary.uploader.upload(fileStr, {
    folder,
    resource_type: "auto",
  });

  return res.secure_url;
};
