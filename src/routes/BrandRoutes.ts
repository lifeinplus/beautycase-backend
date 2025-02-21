import express from "express";

import {
    createBrand,
    deleteBrand,
    readBrands,
    updateBrand,
} from "../controllers/BrandController";
import { requestValidator, rolesVerifier } from "../middlewares";
import { brandBodySchema, brandParamsSchema } from "../validations";

const router = express.Router();

router.post(
    "/",
    rolesVerifier(["admin"]),
    requestValidator({ body: brandBodySchema }),
    createBrand
);

router.get("/", rolesVerifier(["admin", "mua"]), readBrands);

router.put(
    "/:id",
    rolesVerifier(["admin"]),
    requestValidator({ body: brandBodySchema, params: brandParamsSchema }),
    updateBrand
);

router.delete(
    "/:id",
    rolesVerifier(["admin"]),
    requestValidator({ params: brandParamsSchema }),
    deleteBrand
);

export default router;
