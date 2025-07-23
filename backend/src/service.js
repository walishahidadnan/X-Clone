import express from "express"
import cors from "cors"
import {clerkMiddleware} from "@clerk/express"
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js";

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/user", userRoutes);
app.get("/api/post", postRoutes);

app.use((err, res, req) => {
  console.error("Route not found", err);
  res.status(500).json({ error: err.message || "Route not found" });
})


const startSever = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); 
  }
}

startSever();
