import express from "express";

import { getUserById, getAllUsers } from "../controllers/UserController";
import requestValidator from "../middlewares/requestValidator";
import rolesVerifier from "../middlewares/rolesVerifier";
import { userParamsSchema } from "../validations/userSchema";

const router = express.Router();

router.get("/:id", requestValidator({ params: userParamsSchema }), getUserById);

router.get("/", rolesVerifier(["admin", "mua"]), getAllUsers);

export default router;
