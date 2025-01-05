import express from "express";

import {
    addLesson,
    addLessonsList,
    deleteLessonById,
    editLesson,
    getLessonById,
    getLessons,
} from "../controllers/LessonController";
import { requestValidator, rolesVerifier } from "../middlewares";
import {
    lessonBodySchema,
    lessonParamsSchema,
} from "../validations/lessonSchema";

const router = express.Router();

router.get("/all", getLessons);
router.get(
    "/:id",
    requestValidator({ params: lessonParamsSchema }),
    getLessonById
);

router.post(
    "/one",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: lessonBodySchema }),
    addLesson
);
router.post("/many", rolesVerifier(["admin", "mua"]), addLessonsList);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: lessonBodySchema, params: lessonParamsSchema }),
    editLesson
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: lessonParamsSchema }),
    deleteLessonById
);

export default router;
