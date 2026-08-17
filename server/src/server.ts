import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Fuel Station API is running"
  });
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Fuel Station API running on http://localhost:${PORT}`);
});