import express from "express";

import {
    login,
    logout,
    refresh,
    register,
} from "../controllers/AuthController";
import { requestValidator } from "../middlewares";
import { loginSchema, registerSchema } from "../validations";

const router = express.Router();

router.get("/refresh", refresh);

router.post("/login", requestValidator({ body: loginSchema }), login);
router.post("/logout", logout);
router.post("/register", requestValidator({ body: registerSchema }), register);

export default router;
