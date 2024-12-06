import express from "express";

import {
    addProduct,
    addProductsList,
    getProductById,
    getProducts,
} from "../controllers/ProductController";

const router = express.Router();

router.get("/all", getProducts);
router.get("/:id", getProductById);

router.post("/one", addProduct);
router.post("/many", addProductsList);

export default router;
