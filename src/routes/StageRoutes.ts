import express from "express";

import {
    createStage,
    duplicateStageById,
    getStageById,
    getAllStages,
    updateStageById,
    deleteStageById,
} from "../controllers/StageController";
import rolesVerifier from "../middlewares/rolesVerifier";
import requestValidator from "../middlewares/requestValidator";
import { stageBodySchema, stageParamsSchema } from "../validations/stageSchema";

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

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: stageParamsSchema }),
    deleteStageById
);

export default router;
