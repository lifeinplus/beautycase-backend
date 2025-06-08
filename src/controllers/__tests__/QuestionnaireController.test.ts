import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import * as QuestionnaireService from "../../services/QuestionnaireService";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockErrorDatabase } from "../../tests/mocks/error";
import {
    mockQuestionnaire1,
    mockQuestionnaire2,
    mockQuestionnaireId,
} from "../../tests/mocks/questionnaire";

jest.mock("../../services/QuestionnaireService");

const request = supertest(app);
let token: string;

beforeAll(async () => {
    token = jwt.sign(
        { ...mockUserJwt },
        config.auth.accessToken.secret,
        config.auth.accessToken.options
    );
});

describe("QuestionnaireController", () => {
    describe("POST /api/questionnaires", () => {
        it("should create a questionnaire", async () => {
            jest.mocked(
                QuestionnaireService.createQuestionnaire as jest.Mock
            ).mockResolvedValue({ _id: mockQuestionnaireId });

            const response = await request
                .post("/api/questionnaires")
                .set("Authorization", `Bearer ${token}`)
                .send(mockQuestionnaire2);

            expect(response.statusCode).toBe(201);

            expect(response.body).toEqual({
                id: mockQuestionnaireId,
                message: "Questionnaire created successfully",
            });

            expect(
                QuestionnaireService.createQuestionnaire
            ).toHaveBeenCalledWith(mockQuestionnaire2);
        });

        it("should return 500 if creating a questionnaire fails", async () => {
            const mockCreateQuestionnaire = jest.spyOn(
                QuestionnaireService,
                "createQuestionnaire"
            );

            mockCreateQuestionnaire.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .post("/api/questionnaires")
                .set("Authorization", `Bearer ${token}`)
                .send(mockQuestionnaire2);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toEqual(mockErrorDatabase.message);

            expect(
                QuestionnaireService.createQuestionnaire
            ).toHaveBeenCalledWith(mockQuestionnaire2);

            mockCreateQuestionnaire.mockRestore();
        });
    });

    describe("GET /api/questionnaires", () => {
        it("should get all questionnaires (imageUrl only)", async () => {
            const mockQuestionnaires = [mockQuestionnaire1, mockQuestionnaire2];

            jest.mocked(
                QuestionnaireService.getAllQuestionnaires as jest.Mock
            ).mockResolvedValue(mockQuestionnaires);

            const response = await request
                .get("/api/questionnaires")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockQuestionnaires);
            expect(
                QuestionnaireService.getAllQuestionnaires
            ).toHaveBeenCalledTimes(1);
        });

        it("should return 500 if getting all questionnaires fails", async () => {
            const mockGetAllQuestionnaires = jest.spyOn(
                QuestionnaireService,
                "getAllQuestionnaires"
            );

            mockGetAllQuestionnaires.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .get("/api/questionnaires")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toEqual(mockErrorDatabase.message);
            expect(
                QuestionnaireService.getAllQuestionnaires
            ).toHaveBeenCalledTimes(1);

            mockGetAllQuestionnaires.mockRestore();
        });
    });

    describe("GET /api/questionnaires/:id", () => {
        it("should get a questionnaire", async () => {
            const mockResult = {
                _id: mockQuestionnaireId,
                ...mockQuestionnaire1,
            };

            jest.mocked(
                QuestionnaireService.getQuestionnaireById as jest.Mock
            ).mockResolvedValue(mockResult);

            const response = await request
                .get(`/api/questionnaires/${mockQuestionnaireId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockResult);

            expect(
                QuestionnaireService.getQuestionnaireById
            ).toHaveBeenCalledTimes(1);
            expect(
                QuestionnaireService.getQuestionnaireById
            ).toHaveBeenCalledWith(mockQuestionnaireId);
        });

        it("should return 500 if getting a questionnaire fails", async () => {
            const mockGetQuestionnaireById = jest.spyOn(
                QuestionnaireService,
                "getQuestionnaireById"
            );

            mockGetQuestionnaireById.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .get(`/api/questionnaires/${mockQuestionnaireId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe(mockErrorDatabase.message);

            expect(
                QuestionnaireService.getQuestionnaireById
            ).toHaveBeenCalledWith(mockQuestionnaireId);

            mockGetQuestionnaireById.mockRestore();
        });
    });
});
