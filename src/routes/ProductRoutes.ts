import express from "express";

import {
    addProduct,
    addProductsList,
    getProducts,
} from "../controllers/ProductController";

const router = express.Router();

router.get("/all", getProducts);

router.post("/one", addProduct);
router.post("/many", addProductsList);

export default router;
