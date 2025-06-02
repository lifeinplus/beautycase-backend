import express from "express";

import { loginUser } from "../controllers/auth/LoginController";
import { logoutUser } from "../controllers/auth/LogoutController";
import { refreshToken } from "../controllers/auth/RefreshController";
import { registerUser } from "../controllers/auth/RegisterController";
import requestValidator from "../middlewares/requestValidator";
import { loginSchema } from "../validations/loginSchema";
import { registerSchema } from "../validations/registerSchema";

const router = express.Router();

router.post("/login", requestValidator({ body: loginSchema }), loginUser);

router.post("/logout", logoutUser);

router.post(
    "/register",
    requestValidator({ body: registerSchema }),
    registerUser
);

router.get("/refresh", refreshToken);

export default router;
