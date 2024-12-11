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
import { bodySchema, paramsSchema } from "../validations/productSchema";

const router = express.Router();

router.get("/all", getProducts);
router.get("/:id", requestValidator({ params: paramsSchema }), getProductById);

router.post("/one", requestValidator({ body: bodySchema }), addProduct);
router.post("/many", addProductsList);

router.put(
    "/:id",
    requestValidator({ body: bodySchema, params: paramsSchema }),
    editProduct
);

router.delete(
    "/:id",
    requestValidator({ params: paramsSchema }),
    deleteProductById
);

export default router;
