import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDb from "./config/db.js";

import memberRoutes from "./routes/memberRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

connectDb();

app.use(cors());
app.use(express.json());

app.use("/api/members", memberRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Gym backend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
