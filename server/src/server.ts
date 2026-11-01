import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database";
import shiftRoutes from "./routes/shiftRoutes";
import attendantRoutes from "./routes/attendantRoutes";

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use("/api/shifts", shiftRoutes);
app.use("/api/attendants", attendantRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Fuel Station API is running",
  });
});

app.get("/api/db-test", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS connected");

    res.json({
      success: true,
      message: "MySQL connection successful",
      data: rows,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "MySQL connection failed",
    });
  }
});

/* =========================
   SERVER
========================= */

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Fuel Station API running on http://localhost:${PORT}`);
});
