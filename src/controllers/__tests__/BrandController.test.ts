import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import type { Brand } from "../../models/BrandModel";
import * as BrandService from "../../services/BrandService";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockError } from "../../tests/mocks/error";

jest.mock("../../services/BrandService");

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

    describe("POST /api/brands", () => {
        it("should create a new brand", async () => {
            jest.mocked(
                BrandService.createBrand as jest.Mock
            ).mockResolvedValue({ _id: mockId });

            const res = await request
                .post("/api/brands")
                .set("Authorization", `Bearer ${token}`)
                .send(mockBrand1);

            expect(BrandService.createBrand).toHaveBeenCalledWith(mockBrand1);

            expect(res.status).toBe(201);
            expect(res.body.count).toBe(1);
            expect(res.body.id).toBe(mockId);
            expect(res.body.message).toBe("Brand created successfully");
        });

        it("should return 500 if creating a brand fails", async () => {
            const mockCreateBrand = jest.spyOn(BrandService, "createBrand");
            mockCreateBrand.mockRejectedValue(mockError);

            const res = await request
                .post("/api/brands")
                .set("Authorization", `Bearer ${token}`)
                .send(mockBrand1);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty("message");

            mockCreateBrand.mockRestore();
        });
    });

    describe("GET /api/brands", () => {
        it("should return all brands", async () => {
            const mockBrands = [mockBrand1, mockBrand2];

            jest.mocked(
                BrandService.getAllBrands as jest.Mock
            ).mockResolvedValue(mockBrands);

            const res = await request
                .get("/api/brands")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockBrands);
        });

        it("should return 500 if getting all brands fails", async () => {
            const mockGetAllBrands = jest.spyOn(BrandService, "getAllBrands");
            mockGetAllBrands.mockRejectedValue(mockError);

            const res = await request
                .get("/api/brands")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty("message");

            mockGetAllBrands.mockRestore();
        });
    });

    describe("PUT /api/brands/:id", () => {
        it("should update a brand by id", async () => {
            jest.mocked(
                BrandService.updateBrandById as jest.Mock
            ).mockResolvedValue({ _id: mockId });

            const res = await request
                .put(`/api/brands/${mockId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockBrand2);

            expect(BrandService.updateBrandById).toHaveBeenCalledWith(
                mockId,
                mockBrand2
            );

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(mockId);
            expect(res.body.message).toBe("Brand updated successfully");
        });

        it("should return 500 if updating a brand fails", async () => {
            const mockUpdateBrandById = jest.spyOn(
                BrandService,
                "updateBrandById"
            );

            mockUpdateBrandById.mockRejectedValue(mockError);

            const res = await request
                .put(`/api/brands/${mockId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockBrand1);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty("message");

            mockUpdateBrandById.mockRestore();
        });
    });

    describe("DELETE /api/brands/:id", () => {
        it("should delete a brand", async () => {
            jest.mocked(
                BrandService.deleteBrandById as jest.Mock
            ).mockResolvedValue({ _id: mockId });

            const res = await request
                .delete(`/api/brands/${mockId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(BrandService.deleteBrandById).toHaveBeenCalledWith(mockId);

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(mockId);
            expect(res.body.message).toBe("Brand deleted successfully");
        });

        it("should return 500 if deleting a brand fails", async () => {
            const mockDeleteBrandById = jest.spyOn(
                BrandService,
                "deleteBrandById"
            );

            mockDeleteBrandById.mockRejectedValue(mockError);

            const res = await request
                .delete(`/api/brands/${mockId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty("message");

            mockDeleteBrandById.mockRestore();
        });
    });
});
