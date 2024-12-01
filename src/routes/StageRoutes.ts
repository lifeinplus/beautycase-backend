import express from "express";

import {
    addStage,
    addStagesList,
    getStages,
} from "../controllers/StageController";

const router = express.Router();

router.get("/all", getStages);

router.post("/one", addStage);
router.post("/many", addStagesList);

export default router;
