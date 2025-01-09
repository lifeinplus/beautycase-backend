import express from "express";

import {
    addStage,
    addStagesList,
    deleteStageById,
    editStage,
    getStageById,
    getStages,
} from "../controllers/StageController";
import { requestValidator, rolesVerifier } from "../middlewares";
import { stageBodySchema, stageParamsSchema } from "../validations";

const router = express.Router();

router.get("/all", rolesVerifier(["admin", "mua"]), getStages);
router.get(
    "/:id",
    requestValidator({ params: stageParamsSchema }),
    getStageById
);

router.post(
    "/one",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: stageBodySchema }),
    addStage
);
router.post("/many", rolesVerifier(["admin", "mua"]), addStagesList);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: stageBodySchema, params: stageParamsSchema }),
    editStage
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: stageParamsSchema }),
    deleteStageById
);

export default router;
