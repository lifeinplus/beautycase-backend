import express from "express";

import {
    createMakeupBag,
    readMakeupBag,
    readMakeupBags,
    updateMakeupBag,
    deleteMakeupBag,
} from "../controllers/MakeupBagController";
import rolesVerifier from "../middlewares/rolesVerifier";
import requestValidator from "../middlewares/requestValidator";
import {
    makeupBagBodySchema,
    makeupBagParamsSchema,
} from "../validations/makeupBagSchema";

const router = express.Router();

router.post(
    "/",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: makeupBagBodySchema }),
    createMakeupBag
);

router.get(
    "/:id",
    requestValidator({ params: makeupBagParamsSchema }),
    readMakeupBag
);

router.get("/", rolesVerifier(["admin", "mua"]), readMakeupBags);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({
        body: makeupBagBodySchema,
        params: makeupBagParamsSchema,
    }),
    updateMakeupBag
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: makeupBagParamsSchema }),
    deleteMakeupBag
);

export default router;
