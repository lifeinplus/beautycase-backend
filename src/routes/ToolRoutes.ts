import express from "express";

import {
    createTool,
    getToolById,
    getAllTools,
    updateToolById,
    deleteToolById,
} from "../controllers/ToolController";
import rolesVerifier from "../middlewares/rolesVerifier";
import requestValidator from "../middlewares/requestValidator";
import { toolBodySchema, toolParamsSchema } from "../validations/toolSchema";

const router = express.Router();

router.post(
    "/",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: toolBodySchema }),
    createTool
);

router.get("/:id", requestValidator({ params: toolParamsSchema }), getToolById);

router.get("/", rolesVerifier(["admin", "mua"]), getAllTools);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: toolBodySchema, params: toolParamsSchema }),
    updateToolById
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: toolParamsSchema }),
    deleteToolById
);

export default router;
