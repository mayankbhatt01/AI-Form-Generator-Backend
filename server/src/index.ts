import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

import formRoutes from "./routes/forms";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req, res) => {
  res.send("Server is Running")
})

app.use("/api/forms", formRoutes);
// Routes
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(4000, () => console.log("Server running on http://localhost:4000"));
  })
  .catch(err => console.error(err));
