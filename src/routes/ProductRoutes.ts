import express from "express";

import {
    addProduct,
    deleteProductById,
    editProduct,
    getProductById,
    getProducts,
} from "../controllers/ProductController";
import { requestValidator, rolesVerifier } from "../middlewares";
import {
    productBodySchema,
    productParamsSchema,
} from "../validations/productSchema";

const router = express.Router();

router.get("/all", rolesVerifier(["admin", "mua"]), getProducts);

router.get(
    "/:id",
    requestValidator({ params: productParamsSchema }),
    getProductById
);

router.post(
    "/one",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: productBodySchema }),
    addProduct
);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: productBodySchema, params: productParamsSchema }),
    editProduct
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: productParamsSchema }),
    deleteProductById
);

export default router;
