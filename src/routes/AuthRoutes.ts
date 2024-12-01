import express from "express";

import { login, register } from "../controllers/AuthController";
import { requestValidator } from "../middlewares";
import { registerSchema } from "../validations";

const router = express.Router();

router.post("/login", login);
router.post("/register", requestValidator(registerSchema), register);

export default router;
