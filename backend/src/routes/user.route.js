import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { followUser, getCurrentUser, syncUser, updateProfile } from '../controllers/user.controller';

const router = express.Router();

app.get("/profile/:username", getUserProfile);
app.post("/sync", protectRoute, syncUser);
app.post("/me", protectRoute, getCurrentUser);
app.post("/follow/:targetUserId", protectRoute, followUser);
app.put("/profile", protectRoute, updateProfile);

export default router