import express from "express"
import cors from "cors"
import {clerkMiddleware} from "@clerk/express"
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";

const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());
app.use(arcjetMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/user", userRoutes);
app.get("/api/post", postRoutes);
app.get("/api/comments", commentRoutes);
app.get("/api/notifications", notificationRoutes)

app.use((err, res, req, next) => {
  console.error("Route not found", err);
  res.status(500).json({ error: err.message || "Route not found" });
})


const startSever = async () => {
  try {
    await connectDB();
    if(ENV.NODE_ENV !== "production"){
      app.listen(ENV.PORT, () => {
        console.log(`Server is running on port ${ENV.PORT}`);
      });
    }
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); 
  }
}

startSever();

export default app;
