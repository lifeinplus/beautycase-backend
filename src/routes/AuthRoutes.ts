import express from "express";

import { login, refresh, register } from "../controllers/AuthController";
import { requestValidator } from "../middlewares";
import { loginSchema, registerSchema } from "../validations";

const router = express.Router();

router.get("/refresh", refresh);

router.post("/login", requestValidator(loginSchema), login);
router.post("/register", requestValidator(registerSchema), register);

export default router;
