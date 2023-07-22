import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db";
import router from "./router";


//config
const app = express();
dotenv.config();

// database config
try {
  (async () => {
    await connectDB();
  })();
} catch (error) {
  console.log("error connect db", error);
}

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// Connect to MongoDB Atlas

router(app);
// database config
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});


export const viteNodeApp = app;
