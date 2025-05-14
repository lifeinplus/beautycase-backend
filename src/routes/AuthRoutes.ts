import express from "express";

import { login } from "../controllers/auth/LoginController";
import { logout } from "../controllers/auth/LogoutController";
import { refresh } from "../controllers/auth/RefreshController";
import { register } from "../controllers/auth/RegisterController";
import requestValidator from "../middlewares/requestValidator";
import { loginSchema } from "../validations/loginSchema";
import { registerSchema } from "../validations/registerSchema";

const router = express.Router();

router.post("/login", requestValidator({ body: loginSchema }), login);

router.post("/logout", logout);

router.post("/register", requestValidator({ body: registerSchema }), register);

router.get("/refresh", refresh);

export default router;
