import express from "express";

import {
    createStage,
    deleteStage,
    readStageById,
    readStages,
    updateStage,
} from "../controllers/StageController";
import { requestValidator, rolesVerifier } from "../middlewares";
import { stageBodySchema, stageParamsSchema } from "../validations";

const router = express.Router();

router.post(
    "/",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: stageBodySchema }),
    createStage
);

router.get("/", rolesVerifier(["admin", "mua"]), readStages);

router.get(
    "/:id",
    requestValidator({ params: stageParamsSchema }),
    readStageById
);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: stageBodySchema, params: stageParamsSchema }),
    updateStage
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: stageParamsSchema }),
    deleteStage
);

export default router;
