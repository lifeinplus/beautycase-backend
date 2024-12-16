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
import { bodySchema, paramsSchema } from "../validations/lessonSchema";

const router = express.Router();

router.get("/all", getLessons);
router.get("/:id", requestValidator({ params: paramsSchema }), getLessonById);

router.post("/one", requestValidator({ body: bodySchema }), addLesson);
router.post("/many", addLessonsList);

router.put(
    "/:id",
    requestValidator({ body: bodySchema, params: paramsSchema }),
    editLesson
);

router.delete(
    "/:id",
    requestValidator({ params: paramsSchema }),
    deleteLessonById
);

export default router;
