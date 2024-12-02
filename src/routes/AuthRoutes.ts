import express from "express";

import { login, register } from "../controllers/AuthController";
import { requestValidator } from "../middlewares";
import { loginSchema, registerSchema } from "../validations";

const router = express.Router();

router.post("/login", requestValidator(loginSchema), login);
router.post("/register", requestValidator(registerSchema), register);

export default router;
