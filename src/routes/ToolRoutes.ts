import express from "express";

import {
    addTool,
    addToolsList,
    deleteToolById,
    editTool,
    getToolById,
    getTools,
} from "../controllers/ToolController";
import { requestValidator } from "../middlewares";
import { toolBodySchema, toolParamsSchema } from "../validations/toolSchema";

const router = express.Router();

router.get("/all", getTools);
router.get("/:id", requestValidator({ params: toolParamsSchema }), getToolById);

router.post("/one", addTool);
router.post("/many", addToolsList);

router.put(
    "/:id",
    requestValidator({ body: toolBodySchema, params: toolParamsSchema }),
    editTool
);

router.delete(
    "/:id",
    requestValidator({ params: toolParamsSchema }),
    deleteToolById
);

export default router;
