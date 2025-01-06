import express from "express";

import {
    addMakeupBag,
    getMakeupBagById,
    getMakeupBags,
} from "../controllers/MakeupBagController";
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

export default router;
