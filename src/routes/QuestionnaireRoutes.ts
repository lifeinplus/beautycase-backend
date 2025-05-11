import express from "express";

import {
    createQuestionnaire,
    readQuestionnaire,
    readQuestionnaires,
} from "../controllers/QuestionnaireController";
import { jwtVerifier, requestValidator, rolesVerifier } from "../middlewares";
import {
    questionnaireBodySchema,
    questionnaireParamsSchema,
} from "../validations";

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
    readQuestionnaire
);

router.get(
    "/",
    jwtVerifier,
    rolesVerifier(["admin", "mua"]),
    readQuestionnaires
);

export default router;
