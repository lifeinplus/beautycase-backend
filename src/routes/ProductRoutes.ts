import express from "express";

import {
    createProduct,
    getProductById,
    getAllProducts,
    updateProductById,
    deleteProductById,
} from "../controllers/ProductController";
import rolesVerifier from "../middlewares/rolesVerifier";
import requestValidator from "../middlewares/requestValidator";
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
    getProductById
);

router.get("/", rolesVerifier(["admin", "mua"]), getAllProducts);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: productBodySchema, params: productParamsSchema }),
    updateProductById
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: productParamsSchema }),
    deleteProductById
);

export default router;
