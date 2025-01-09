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

router.post(
    "/one",
    requestValidator({ body: toolBodySchema }),
    rolesVerifier(["admin", "mua"]),
    addTool
);
router.post("/many", rolesVerifier(["admin", "mua"]), addToolsList);

router.put(
    "/:id",
    requestValidator({ body: toolBodySchema, params: toolParamsSchema }),
    rolesVerifier(["admin", "mua"]),
    editTool
);

router.delete(
    "/:id",
    requestValidator({ params: toolParamsSchema }),
    rolesVerifier(["admin", "mua"]),
    deleteToolById
);

export default router;
