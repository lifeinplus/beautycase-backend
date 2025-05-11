import express from "express";

import { createCategory, readCategories } from "../controllers";
import { requestValidator, rolesVerifier } from "../middlewares";
import { categoryBodySchema } from "../validations";

const router = express.Router();

router.post(
    "/",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: categoryBodySchema }),
    createCategory
);

router.get("/", rolesVerifier(["admin", "mua"]), readCategories);

export default router;
