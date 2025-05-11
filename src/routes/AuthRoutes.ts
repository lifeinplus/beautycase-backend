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

router.post("/login", requestValidator({ body: loginSchema }), login);

router.post("/logout", logout);

router.post("/register", requestValidator({ body: registerSchema }), register);

router.get("/refresh", refresh);

export default router;
