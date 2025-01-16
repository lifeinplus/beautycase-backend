import express from "express";

import { addStore, getStores } from "../controllers/StoreController";
import { rolesVerifier } from "../middlewares";

const router = express.Router();

router.get("/all", rolesVerifier(["admin", "mua"]), getStores);

router.post("/one", rolesVerifier(["admin", "mua"]), addStore);

export default router;
