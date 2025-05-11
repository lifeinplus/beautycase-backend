import express from "express";

import {
    createProduct,
    readProduct,
    readProducts,
    updateProduct,
    deleteProduct,
} from "../controllers/ProductController";
import { requestValidator, rolesVerifier } from "../middlewares";
import {
    productBodySchema,
    productParamsSchema,
} from "../validations/productSchema";

const router = express.Router();

router.post(
    "/",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: productBodySchema }),
    createProduct
);

router.get(
    "/:id",
    requestValidator({ params: productParamsSchema }),
    readProduct
);

router.get("/", rolesVerifier(["admin", "mua"]), readProducts);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: productBodySchema, params: productParamsSchema }),
    updateProduct
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: productParamsSchema }),
    deleteProduct
);

export default router;
