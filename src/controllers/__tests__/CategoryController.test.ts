import supertest from "supertest";

import app from "../../app";
import { signAccessToken } from "../../services/auth/TokenService";
import * as CategoryService from "../../services/CategoryService";
import { mockUserJwt } from "../../tests/mocks/auth";
import {
    mockCategories,
    mockCategory1,
    mockCategoryId,
} from "../../tests/mocks/category";
import { mockDatabaseError } from "../../tests/mocks/error";

jest.mock("../../services/CategoryService");

const request = supertest(app);

let token: string;

beforeAll(async () => {
    token = signAccessToken(mockUserJwt);
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

            mockCreateCategory.mockRejectedValue(mockDatabaseError);

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

            mockGetAllCategories.mockRejectedValue(mockDatabaseError);

            const response = await request
                .get("/api/categories")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("message");

            mockGetAllCategories.mockRestore();
        });
    });
});
