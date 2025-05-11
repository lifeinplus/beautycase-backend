import express from "express";

import {
    createStage,
    duplicateStage,
    readStage,
    readStages,
    updateStage,
    deleteStage,
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

router.post(
    "/duplicate/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: stageParamsSchema }),
    duplicateStage
);

router.get("/:id", requestValidator({ params: stageParamsSchema }), readStage);

router.get("/", rolesVerifier(["admin", "mua"]), readStages);

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
