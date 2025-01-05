import express from "express";

import {
    addTool,
    addToolsList,
    deleteToolById,
    editTool,
    getToolById,
    getTools,
} from "../controllers/ToolController";
import { requestValidator, rolesVerifier } from "../middlewares";
import { toolBodySchema, toolParamsSchema } from "../validations/toolSchema";

const router = express.Router();

router.get("/all", rolesVerifier(["admin", "mua"]), getTools);
router.get("/:id", requestValidator({ params: toolParamsSchema }), getToolById);

router.post("/one", rolesVerifier(["admin", "mua"]), addTool);
router.post("/many", rolesVerifier(["admin", "mua"]), addToolsList);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: toolBodySchema, params: toolParamsSchema }),
    editTool
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: toolParamsSchema }),
    deleteToolById
);

export default router;
