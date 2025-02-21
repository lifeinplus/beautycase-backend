import express from "express";

import {
    createStore,
    deleteStore,
    readStores,
    updateStore,
} from "../controllers/StoreController";
import { requestValidator, rolesVerifier } from "../middlewares";
import { storeBodySchema, storeParamsSchema } from "../validations";

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
