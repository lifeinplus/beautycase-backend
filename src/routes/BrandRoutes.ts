import express from "express";

import {
    createBrand,
    deleteBrandById,
    getAllBrands,
    updateBrandById,
} from "../controllers/BrandController";
import rolesVerifier from "../middlewares/rolesVerifier";
import requestValidator from "../middlewares/requestValidator";
import { brandBodySchema, brandParamsSchema } from "../validations/brandSchema";

const router = express.Router();

router.post(
    "/",
    rolesVerifier(["admin"]),
    requestValidator({ body: brandBodySchema }),
    createBrand
);

router.get("/", rolesVerifier(["admin", "mua"]), getAllBrands);

router.put(
    "/:id",
    rolesVerifier(["admin"]),
    requestValidator({ body: brandBodySchema, params: brandParamsSchema }),
    updateBrandById
);

router.delete(
    "/:id",
    rolesVerifier(["admin"]),
    requestValidator({ params: brandParamsSchema }),
    deleteBrandById
);

export default router;
