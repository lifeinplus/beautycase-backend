import express from "express";

import {
    createTool,
    readTool,
    readTools,
    updateTool,
    deleteTool,
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

router.get("/:id", requestValidator({ params: toolParamsSchema }), readTool);

router.get("/", rolesVerifier(["admin", "mua"]), readTools);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: toolBodySchema, params: toolParamsSchema }),
    updateTool
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: toolParamsSchema }),
    deleteTool
);

export default router;
