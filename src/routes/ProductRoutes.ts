import express from "express";

import {
    addProduct,
    deleteProductById,
    editProduct,
    getProductById,
    getProducts,
    uploadImageTemp,
} from "../controllers/ProductController";
import { multerUpload, requestValidator, rolesVerifier } from "../middlewares";
import {
    productBodySchema,
    productParamsSchema,
} from "../validations/productSchema";

const router = express.Router();

router.get("/all", rolesVerifier(["admin", "mua"]), getProducts);

router.get(
    "/:id",
    requestValidator({ params: productParamsSchema }),
    getProductById
);

router.post(
    "/image-temp",
    rolesVerifier(["admin", "mua"]),
    multerUpload.single("imageFile"),
    uploadImageTemp
);

router.post(
    "/one",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: productBodySchema }),
    addProduct
);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: productBodySchema, params: productParamsSchema }),
    editProduct
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: productParamsSchema }),
    deleteProductById
);

export default router;
