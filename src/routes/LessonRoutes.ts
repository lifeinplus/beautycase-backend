import express from "express";

import {
    addLesson,
    addLessonsList,
    deleteLessonById,
    editLesson,
    getLessonById,
    getLessons,
} from "../controllers/LessonController";
import { requestValidator } from "../middlewares";
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

router.post("/one", requestValidator({ body: lessonBodySchema }), addLesson);
router.post("/many", addLessonsList);

router.put(
    "/:id",
    requestValidator({ body: lessonBodySchema, params: lessonParamsSchema }),
    editLesson
);

router.delete(
    "/:id",
    requestValidator({ params: lessonParamsSchema }),
    deleteLessonById
);

export default router;
