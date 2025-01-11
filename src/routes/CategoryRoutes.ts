import express from "express";

import { addCategory, getCategories } from "../controllers";
import { requestValidator, rolesVerifier } from "../middlewares";
import { categoryBodySchema } from "../validations";

const router = express.Router();

router.get("/all", rolesVerifier(["admin", "mua"]), getCategories);

router.post(
    "/one",
    requestValidator({ body: categoryBodySchema }),
    rolesVerifier(["admin", "mua"]),
    addCategory
);

export default router;
