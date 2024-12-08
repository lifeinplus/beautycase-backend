import express from "express";

import {
    addProduct,
    addProductsList,
    deleteProductById,
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

router.delete("/:id", deleteProductById);

export default router;
