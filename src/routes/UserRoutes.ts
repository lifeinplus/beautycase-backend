import express from "express";

import { readUser, readUsers } from "../controllers/UserController";
import { requestValidator, rolesVerifier } from "../middlewares";
import { userParamsSchema } from "../validations";

const router = express.Router();

router.get("/:id", requestValidator({ params: userParamsSchema }), readUser);

router.get("/", rolesVerifier(["admin", "mua"]), readUsers);

export default router;
