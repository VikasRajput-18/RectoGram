import express from "express";
import { loginController, signupController } from "../controllers/user.js";
const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);

export default router;
