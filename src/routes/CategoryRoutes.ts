import express from "express";

import {
    createCategory,
    readCategories,
} from "../controllers/CategoryController";
import rolesVerifier from "../middlewares/rolesVerifier";
import requestValidator from "../middlewares/requestValidator";
import { categoryBodySchema } from "../validations/categorySchema";

const router = express.Router();

router.post(
    "/",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: categoryBodySchema }),
    createCategory
);

router.get("/", rolesVerifier(["admin", "mua"]), readCategories);

export default router;
