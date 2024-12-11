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
import { bodySchema, paramsSchema } from "../validations/toolSchema";

const router = express.Router();

router.get("/all", getTools);
router.get("/:id", requestValidator({ params: paramsSchema }), getToolById);

router.post("/one", addTool);
router.post("/many", addToolsList);

router.put(
    "/:id",
    requestValidator({ body: bodySchema, params: paramsSchema }),
    editTool
);

router.delete(
    "/:id",
    requestValidator({ params: paramsSchema }),
    deleteToolById
);

export default router;
