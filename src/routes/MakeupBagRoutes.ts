import express from "express";

import {
    addMakeupBag,
    deleteMakeupBagById,
    editMakeupBag,
    getMakeupBagById,
    getMakeupBags,
} from "../controllers";
import { requestValidator, rolesVerifier } from "../middlewares";
import { makeupBagBodySchema, makeupBagParamsSchema } from "../validations";

const router = express.Router();

router.get("/all", rolesVerifier(["admin", "mua"]), getMakeupBags);
router.get(
    "/:id",
    requestValidator({ params: makeupBagParamsSchema }),
    getMakeupBagById
);

router.post(
    "/one",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: makeupBagBodySchema }),
    addMakeupBag
);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({
        body: makeupBagBodySchema,
        params: makeupBagParamsSchema,
    }),
    editMakeupBag
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: makeupBagParamsSchema }),
    deleteMakeupBagById
);

export default router;
