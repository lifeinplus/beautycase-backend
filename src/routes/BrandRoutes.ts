import express from "express";

import { addBrand, getBrands } from "../controllers/BrandController";
import { rolesVerifier } from "../middlewares";

const router = express.Router();

router.get("/all", rolesVerifier(["admin", "mua"]), getBrands);

router.post("/one", rolesVerifier(["admin", "mua"]), addBrand);

export default router;
