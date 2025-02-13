import express from "express";

import {
    addTool,
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

router.post(
    "/one",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: toolBodySchema }),
    addTool
);

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
