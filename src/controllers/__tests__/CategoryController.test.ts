import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import * as CategoryService from "../../services/CategoryService";
import { mockUserJwt } from "../../tests/mocks/auth";
import {
    mockCategory1,
    mockCategory2,
    mockCategoryId,
} from "../../tests/mocks/category";
import { mockErrorDatabase } from "../../tests/mocks/error";

jest.mock("../../services/CategoryService");

const request = supertest(app);
let token: string;

beforeAll(async () => {
    token = jwt.sign(
        { ...mockUserJwt },
        config.auth.accessToken.secret,
        config.auth.accessToken.options
    );
});

describe("CategoryController", () => {
    describe("POST /api/categories", () => {
        it("should create a category", async () => {
            jest.mocked(
                CategoryService.createCategory as jest.Mock
            ).mockResolvedValue({ _id: mockCategoryId });

            const response = await request
                .post("/api/categories")
                .set("Authorization", `Bearer ${token}`)
                .send(mockCategory1);

            expect(CategoryService.createCategory).toHaveBeenCalledWith(
                mockCategory1
            );

            expect(response.statusCode).toBe(201);
            expect(response.body.id).toBe(mockCategoryId);
            expect(response.body.message).toBe("Category created successfully");
        });

        it("should return 500 if creating a category fails", async () => {
            const mockCreateCategory = jest.spyOn(
                CategoryService,
                "createCategory"
            );

            mockCreateCategory.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .post("/api/categories")
                .set("Authorization", `Bearer ${token}`)
                .send(mockCategory1);

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("message");

            mockCreateCategory.mockRestore();
        });
    });

    describe("GET /api/categories", () => {
        it("should get all categories", async () => {
            const mockCategories = [mockCategory1, mockCategory2];

            jest.mocked(
                CategoryService.getAllCategories as jest.Mock
            ).mockResolvedValue(mockCategories);

            const response = await request
                .get("/api/categories")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockCategories);
        });

        it("should return 500 if getting all categories fails", async () => {
            const mockGetAllCategories = jest.spyOn(
                CategoryService,
                "getAllCategories"
            );

            mockGetAllCategories.mockRejectedValue(mockErrorDatabase);

            const response = await request
                .get("/api/categories")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("message");

            mockGetAllCategories.mockRestore();
        });
    });
});
