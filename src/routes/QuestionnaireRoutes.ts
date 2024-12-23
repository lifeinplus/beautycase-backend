import express from "express";

import { addQuestionnaire } from "../controllers/QuestionnaireController";
import { requestValidator } from "../middlewares";
import { questionnaireSchema } from "../validations";

const router = express.Router();

router.post(
    "/one",
    requestValidator({ body: questionnaireSchema }),
    addQuestionnaire
);

export default router;
