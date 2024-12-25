import express from "express";

import {
    addProduct,
    addProductsList,
    deleteProductById,
    editProduct,
    getProductById,
    getProducts,
} from "../controllers/ProductController";
import { requestValidator } from "../middlewares";
import {
    productBodySchema,
    productParamsSchema,
} from "../validations/productSchema";

const router = express.Router();

router.get("/all", getProducts);
router.get(
    "/:id",
    requestValidator({ params: productParamsSchema }),
    getProductById
);

router.post("/one", requestValidator({ body: productBodySchema }), addProduct);
router.post("/many", addProductsList);

router.put(
    "/:id",
    requestValidator({ body: productBodySchema, params: productParamsSchema }),
    editProduct
);

router.delete(
    "/:id",
    requestValidator({ params: productParamsSchema }),
    deleteProductById
);

export default router;
