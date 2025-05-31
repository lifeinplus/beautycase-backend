import express from "express";

import {
    createQuestionnaire,
    getQuestionnaireById,
    getAllQuestionnaires,
} from "../controllers/QuestionnaireController";
import jwtVerifier from "../middlewares/jwtVerifier";
import requestValidator from "../middlewares/requestValidator";
import rolesVerifier from "../middlewares/rolesVerifier";
import {
    questionnaireBodySchema,
    questionnaireParamsSchema,
} from "../validations/questionnaireSchema";

const router = express.Router();

router.post(
    "/",
    requestValidator({ body: questionnaireBodySchema }),
    createQuestionnaire
);

router.get(
    "/:id",
    jwtVerifier,
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: questionnaireParamsSchema }),
    getQuestionnaireById
);

router.get(
    "/",
    jwtVerifier,
    rolesVerifier(["admin", "mua"]),
    getAllQuestionnaires
);

export default router;
