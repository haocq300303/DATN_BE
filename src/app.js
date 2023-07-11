import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
// import router from "./routes/index.js";

//config
const app = express();
dotenv.config();

// middleware
app.use(cors());
app.use(express.json());

// router

// database config
connectDB();

export const viteNodeApp = app;
