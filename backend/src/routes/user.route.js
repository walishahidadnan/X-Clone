import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { followUser, getCurrentUser, getUserProfile, syncUser, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.post("/sync", protectRoute, syncUser);
router.post("/me", protectRoute, getCurrentUser);
router.post("/follow/:targetUserId", protectRoute, followUser);
router.put("/profile", protectRoute, updateProfile);

export default router;