import express from "express";

import {
    createTool,
    deleteToolById,
    getAllTools,
    getToolById,
    updateToolById,
    updateToolStoreLinks,
} from "../controllers/ToolController";
import requestValidator from "../middlewares/requestValidator";
import rolesVerifier from "../middlewares/rolesVerifier";
import {
    toolBodySchema,
    toolParamsSchema,
    toolStoreLinksBodySchema,
} from "../validations/toolSchema";

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

router.patch(
    "/:id/store-links",
    rolesVerifier(["admin", "mua"]),
    requestValidator({
        body: toolStoreLinksBodySchema,
        params: toolParamsSchema,
    }),
    updateToolStoreLinks
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: toolParamsSchema }),
    deleteToolById
);

export default router;
