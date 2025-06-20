// Load dotenv if not loaded already
import dotenv from "dotenv";

if (!process.env.PORT) {
  dotenv.config();
}

module.exports = {
  port: process.env.PORT || 8000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || "lono-secure-jwt-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  env: process.env.NODE_ENV || "development",
  fileUpload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB in bytes
    allowedFileTypes: (
      process.env.ALLOWED_FILE_TYPES || "jpeg,jpg,png,pdf,doc,docx,xls,xlsx"
    ).split(","),
  },
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@pravishto.com",
    password: process.env.ADMIN_PASSWORD || "admin@123",
  },
};
