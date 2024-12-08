import express from "express";

import {
    addProduct,
    addProductsList,
    editProduct,
    getProductById,
    getProducts,
} from "../controllers/ProductController";

const router = express.Router();

router.get("/all", getProducts);
router.get("/:id", getProductById);

router.post("/one", addProduct);
router.post("/many", addProductsList);

router.put("/:id", editProduct);

export default router;
