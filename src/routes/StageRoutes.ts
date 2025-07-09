import express from "express";

import {
    createStage,
    deleteStageById,
    duplicateStageById,
    getAllStages,
    getStageById,
    updateStageById,
    updateStageProducts,
} from "../controllers/StageController";
import requestValidator from "../middlewares/requestValidator";
import rolesVerifier from "../middlewares/rolesVerifier";
import {
    stageBodySchema,
    stageParamsSchema,
    stageProductsBodySchema,
} from "../validations/stageSchema";

const router = express.Router();

router.post(
    "/",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: stageBodySchema }),
    createStage
);

router.post(
    "/duplicate/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: stageParamsSchema }),
    duplicateStageById
);

router.get(
    "/:id",
    requestValidator({ params: stageParamsSchema }),
    getStageById
);

router.get("/", rolesVerifier(["admin", "mua"]), getAllStages);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: stageBodySchema, params: stageParamsSchema }),
    updateStageById
);

router.patch(
    "/:id/products",
    rolesVerifier(["admin", "mua"]),
    requestValidator({
        body: stageProductsBodySchema,
        params: stageParamsSchema,
    }),
    updateStageProducts
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: stageParamsSchema }),
    deleteStageById
);

export default router;
