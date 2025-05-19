import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import CategoryModel from "../../models/CategoryModel";
import type { Category } from "../../models/CategoryModel";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockError } from "../../tests/mocks/error";

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
    const mockCategory1: Category = {
        name: "Базовая косметичка",
        type: "makeup_bag",
    };

    const mockCategory2: Category = {
        name: "Люксовая косметичка",
        type: "makeup_bag",
    };

    describe("createCategory", () => {
        it("should create a new category", async () => {
            const res = await request
                .post("/api/categories")
                .set("Authorization", `Bearer ${token}`)
                .send(mockCategory1);

            expect(res.status).toBe(201);
            expect(res.body.message).toBe("Category created successfully");

            const category = await CategoryModel.findOne({
                name: mockCategory1.name,
            });

            expect(category).not.toBeNull();
        });

        it("should return an error if category creation fails", async () => {
            const mockCreate = jest.spyOn(CategoryModel, "create");
            mockCreate.mockRejectedValue(mockError);

            const res = await request
                .post("/api/categories")
                .set("Authorization", `Bearer ${token}`)
                .send(mockCategory1)
                .expect(500);

            expect(res.body).toHaveProperty("message");
            mockCreate.mockRestore();
        });
    });

    describe("readCategories", () => {
        it("should get all categories", async () => {
            await CategoryModel.create([mockCategory1, mockCategory2]);

            const res = await request
                .get("/api/categories")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });

        it("should return 404 if no categories exist", async () => {
            const res = await request
                .get("/api/categories")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Categories not found");
        });
    });
});
