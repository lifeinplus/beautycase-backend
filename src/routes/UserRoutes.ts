import express from "express";

import { readUser, readUsers } from "../controllers/UserController";
import requestValidator from "../middlewares/requestValidator";
import rolesVerifier from "../middlewares/rolesVerifier";
import { userParamsSchema } from "../validations/userSchema";

const router = express.Router();

router.get("/:id", requestValidator({ params: userParamsSchema }), readUser);

router.get("/", rolesVerifier(["admin", "mua"]), readUsers);

export default router;
