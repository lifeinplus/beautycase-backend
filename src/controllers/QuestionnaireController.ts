import { NextFunction, Request, Response } from "express";

import { QuestionnaireModel } from "../models";

export const addQuestionnaire = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const questionnaire = new QuestionnaireModel(req.body);

        const response = await questionnaire.save();

        res.status(201).json({
            count: 1,
            id: response._id,
            message: "Questionnaire added successfully",
        });
    } catch (error) {
        next(error);
    }
};
