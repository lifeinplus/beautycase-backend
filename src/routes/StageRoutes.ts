import express from "express";

import {
    addStage,
    addStagesList,
    getStages,
} from "../controllers/StageController";
import { rolesVerifier } from "../middlewares";

const router = express.Router();

router.get("/all", getStages);

router.post("/one", rolesVerifier(["admin", "mua"]), addStage);
router.post("/many", rolesVerifier(["admin", "mua"]), addStagesList);

export default router;
