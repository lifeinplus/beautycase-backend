import express from "express";

import { getUserById, getUsers } from "../controllers/UserController";
import { requestValidator, rolesVerifier } from "../middlewares";
import { userParamsSchema } from "../validations";

const router = express.Router();

router.get("/all", rolesVerifier(["admin", "mua"]), getUsers);
router.get("/:id", requestValidator({ params: userParamsSchema }), getUserById);

export default router;
