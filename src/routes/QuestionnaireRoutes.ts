import express from "express";

import {
    addQuestionnaire,
    getQuestionnaireById,
    getQuestionnaires,
} from "../controllers/QuestionnaireController";
import { requestValidator } from "../middlewares";
import {
    questionnaireBodySchema,
    questionnaireParamsSchema,
} from "../validations";

const router = express.Router();

router.get("/all", getQuestionnaires);
router.get(
    "/:id",
    requestValidator({ params: questionnaireParamsSchema }),
    getQuestionnaireById
);

router.post(
    "/one",
    requestValidator({ body: questionnaireBodySchema }),
    addQuestionnaire
);

export default router;
