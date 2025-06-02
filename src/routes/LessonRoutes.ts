import express from "express";

import {
    createLesson,
    getLessonById,
    getAllLessons,
    updateLessonById,
    deleteLessonById,
} from "../controllers/LessonController";
import rolesVerifier from "../middlewares/rolesVerifier";
import requestValidator from "../middlewares/requestValidator";
import {
    lessonBodySchema,
    lessonParamsSchema,
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
    getLessonById
);

router.get("/", getAllLessons);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: lessonBodySchema, params: lessonParamsSchema }),
    updateLessonById
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: lessonParamsSchema }),
    deleteLessonById
);

export default router;
