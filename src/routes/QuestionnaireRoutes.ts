import express from "express";

import {
    addQuestionnaire,
    getQuestionnaireById,
    getQuestionnaires,
} from "../controllers/QuestionnaireController";
import {
    jwtVerifier,
    requestValidator,
    rolesVerifier,
    multerUpload,
} from "../middlewares";
import {
    questionnaireBodySchema,
    questionnaireParamsSchema,
} from "../validations";

const router = express.Router();

router.get(
    "/all",
    jwtVerifier,
    rolesVerifier(["admin", "mua"]),
    getQuestionnaires
);
router.get(
    "/:id",
    jwtVerifier,
    rolesVerifier(["admin", "mua"]),
    requestValidator({ params: questionnaireParamsSchema }),
    getQuestionnaireById
);

router.post(
    "/one",
    requestValidator({ body: questionnaireBodySchema }),
    addQuestionnaire
);

export default router;
