import express from "express";

import {
    createStore,
    deleteStore,
    readStores,
    updateStore,
} from "../controllers/StoreController";
import { rolesVerifier } from "../middlewares";

const router = express.Router();

router.post("/", rolesVerifier(["admin"]), createStore);
router.get("/", rolesVerifier(["admin", "mua"]), readStores);
router.put("/:id", rolesVerifier(["admin"]), updateStore);
router.delete("/:id", rolesVerifier(["admin"]), deleteStore);

export default router;
