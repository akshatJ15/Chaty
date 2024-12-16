import express from 'express';
import {login,signup,logout,updateProfile,checkAuth} from '../controllers/auth.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router =express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

router.put("/update-proflie", protectRoute, updateProfile);

router.get("/check",protectRoute,checkAuth);

export default router;