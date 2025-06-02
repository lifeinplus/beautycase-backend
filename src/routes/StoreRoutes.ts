import express from "express";

import {
    createStore,
    deleteStoreById,
    getAllStores,
    updateStoreById,
} from "../controllers/StoreController";
import rolesVerifier from "../middlewares/rolesVerifier";
import requestValidator from "../middlewares/requestValidator";
import { storeBodySchema, storeParamsSchema } from "../validations/storeSchema";

const router = express.Router();

router.post(
    "/",
    rolesVerifier(["admin"]),
    requestValidator({ body: storeBodySchema }),
    createStore
);

router.get("/", rolesVerifier(["admin", "mua"]), getAllStores);

router.put(
    "/:id",
    rolesVerifier(["admin"]),
    requestValidator({ body: storeBodySchema, params: storeParamsSchema }),
    updateStoreById
);

router.delete(
    "/:id",
    rolesVerifier(["admin"]),
    requestValidator({ params: storeParamsSchema }),
    deleteStoreById
);

export default router;
