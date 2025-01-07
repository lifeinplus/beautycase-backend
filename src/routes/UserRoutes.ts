import express from "express";

import { getUsers } from "../controllers/UserController";
import { rolesVerifier } from "../middlewares";

const router = express.Router();

router.get("/all", rolesVerifier(["admin", "mua"]), getUsers);

export default router;
