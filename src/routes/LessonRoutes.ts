import express from "express";

import {
    createLesson,
    deleteLessonById,
    getAllLessons,
    getLessonById,
    updateLessonById,
    updateLessonProducts,
} from "../controllers/LessonController";
import { checkLessonAccess } from "../middlewares/checkLessonAccess";
import requestValidator from "../middlewares/requestValidator";
import rolesVerifier from "../middlewares/rolesVerifier";
import {
    lessonBodySchema,
    lessonParamsSchema,
    lessonProductsBodySchema,
} from "../validations/lessonSchema";

const router = express.Router();

router.post(
    "/",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: lessonBodySchema }),
    createLesson
);

router.get(
    "/:id",
    requestValidator({ params: lessonParamsSchema }),
    checkLessonAccess,
    getLessonById
);

router.get("/", getAllLessons);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: lessonBodySchema, params: lessonParamsSchema }),
    updateLessonById
);

router.patch(
    "/:id/products",
    rolesVerifier(["admin", "mua"]),
    requestValidator({
        body: lessonProductsBodySchema,
        params: lessonParamsSchema,
    }),
    updateLessonProducts
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: lessonParamsSchema }),
    deleteLessonById
);

export default router;
