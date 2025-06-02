import express from "express";

import {
    createMakeupBag,
    getMakeupBagById,
    getAllMakeupBags,
    updateMakeupBagById,
    deleteMakeupBagById,
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
    getMakeupBagById
);

router.get("/", rolesVerifier(["admin", "mua"]), getAllMakeupBags);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({
        body: makeupBagBodySchema,
        params: makeupBagParamsSchema,
    }),
    updateMakeupBagById
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: makeupBagParamsSchema }),
    deleteMakeupBagById
);

export default router;
