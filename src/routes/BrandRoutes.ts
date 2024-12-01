import express from "express";

import { addBrand, getBrands } from "../controllers/BrandController";

const router = express.Router();

router.get("/all", getBrands);
router.post("/one", addBrand);

export default router;
