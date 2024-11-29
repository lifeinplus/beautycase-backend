import express from "express";

import { addTool, addToolsList, getTools } from "../controllers/ToolController";

const router = express.Router();

router.get("/all", getTools);

router.post("/one", addTool);
router.post("/many", addToolsList);

export default router;
