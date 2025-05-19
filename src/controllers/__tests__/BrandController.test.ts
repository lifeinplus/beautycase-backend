import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import BrandModel from "../../models/BrandModel";
import type { Brand } from "../../models/BrandModel";
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

describe("BrandController", () => {
    const mockId = "682a378b09c4df2756fcece5";
    const mockBrand1: Brand = { name: "Annbeauty" };
    const mockBrand2: Brand = { name: "ManlyPRO" };

    describe("createBrand", () => {
        it("should create a new brand", async () => {
            const res = await request
                .post("/api/brands")
                .set("Authorization", `Bearer ${token}`)
                .send(mockBrand1);

            expect(res.status).toBe(201);
            expect(res.body.message).toBe("Brand created successfully");

            const brand = await BrandModel.findOne(mockBrand1);
            expect(brand).not.toBeNull();
        });

        it("should return an error if brand creation fails", async () => {
            const mockCreate = jest.spyOn(BrandModel, "create");
            mockCreate.mockRejectedValue(mockError);

            const res = await request
                .post("/api/brands")
                .set("Authorization", `Bearer ${token}`)
                .send(mockBrand1)
                .expect(500);

            expect(res.body).toHaveProperty("message");
            mockCreate.mockRestore();
        });
    });

    describe("readBrands", () => {
        it("should return all brands", async () => {
            await BrandModel.insertMany([mockBrand1, mockBrand2]);

            const res = await request
                .get("/api/brands")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });

        it("should return 404 if no brands exist", async () => {
            const res = await request
                .get("/api/brands")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Brands not found");
        });
    });

    describe("updateBrand", () => {
        it("should update a brand", async () => {
            const brand = await BrandModel.create(mockBrand1);

            const res = await request
                .put(`/api/brands/${brand._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockBrand2);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Brand updated successfully");

            const updated = await BrandModel.findById(brand._id);
            expect(updated?.name).toBe(mockBrand2.name);
        });

        it("should return 404 when updating a non-existent brand", async () => {
            const res = await request
                .put(`/api/brands/${mockId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockBrand1);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Brand not found");
        });
    });

    describe("deleteBrand", () => {
        it("should delete a brand", async () => {
            const brand = await BrandModel.create(mockBrand1);

            const res = await request
                .delete(`/api/brands/${brand._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Brand deleted successfully");

            const deleted = await BrandModel.findById(brand._id);
            expect(deleted).toBeNull();
        });

        it("should handle errors during brand deletion", async () => {
            jest.spyOn(BrandModel, "findByIdAndDelete").mockRejectedValue(
                mockError
            );

            await request
                .delete(`/api/brands/${mockId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(500);
        });
    });
});
