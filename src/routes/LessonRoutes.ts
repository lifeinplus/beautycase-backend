import express from "express";

import {
    createLesson,
    readLesson,
    readLessons,
    updateLesson,
    deleteLesson,
} from "../controllers/LessonController";
import { requestValidator, rolesVerifier } from "../middlewares";
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
    readLesson
);

router.get("/", readLessons);

router.put(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ body: lessonBodySchema, params: lessonParamsSchema }),
    updateLesson
);

router.delete(
    "/:id",
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: lessonParamsSchema }),
    deleteLesson
);

export default router;
