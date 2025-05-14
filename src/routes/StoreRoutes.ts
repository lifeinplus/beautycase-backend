import express from "express";

import {
    createStore,
    deleteStore,
    readStores,
    updateStore,
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

router.get("/", rolesVerifier(["admin", "mua"]), readStores);

router.put(
    "/:id",
    rolesVerifier(["admin"]),
    requestValidator({ body: storeBodySchema, params: storeParamsSchema }),
    updateStore
);

router.delete(
    "/:id",
    rolesVerifier(["admin"]),
    requestValidator({ params: storeParamsSchema }),
    deleteStore
);

export default router;
