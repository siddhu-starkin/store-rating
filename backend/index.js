import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { initializeSocket } from "./socket/socket.js";
import { PrismaClient } from '@prisma/client';

import authRoutes from "./routes/auth.js";
import path from "path";
import storeRoutes from "./routes/stores.js";
import ratingRoutes from "./routes/ratings.js";
import userRoutes from "./routes/users.js";
const app = express();
const server = http.createServer(app);
const _dirname=path.dirname("")
const buildpath=path.join(_dirname,"../frontend/dist")
app.use(express.static(buildpath));

// Initialize Prisma Client
const prisma = new PrismaClient();

app.use(
  cors({
    "origin":"*",
  })
); // CORS handles cross-origin requests, not payload size
app.use(express.json({ limit: "20mb" })); // Set 10MB limit for JSON payloads
app.use(express.urlencoded({ limit: "20mb", extended: true })); // Set 10MB limit for URL-encoded payloads
app.use(morgan('dev'));
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// } else if (process.env.NODE_ENV !== "test") {
//   const logDir = path.join(__dirname, "logs");
//   if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
//   const accessLogStream = fs.createWriteStream(
//     path.join(logDir, "access.log"),
//     { flags: "a" }
//   );
//   app.use(morgan("combined", { stream: accessLogStream }));
// }

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.static(path.join(__dirname, "public")));
const io = initializeSocket(server);
app.set("io", io);

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  console.error("🔥 Internal Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("http://localhost:8000");
});

export default app;

