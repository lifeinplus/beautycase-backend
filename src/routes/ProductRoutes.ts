import express from "express";

import {
    createProduct,
    deleteProductById,
    getAllProducts,
    getProductById,
    updateProductById,
    updateProductStoreLinks,
} from "../controllers/ProductController";
import requestValidator from "../middlewares/requestValidator";
import rolesVerifier from "../middlewares/rolesVerifier";
import {
    productBodySchema,
    productParamsSchema,
    productStoreLinksBodySchema,
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

router.patch(
    "/:id/store-links",
    rolesVerifier(["admin", "mua"]),
    requestValidator({
        body: productStoreLinksBodySchema,
        params: productParamsSchema,
    }),
    updateProductStoreLinks
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: productParamsSchema }),
    deleteProductById
);

export default router;
