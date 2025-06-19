import supertest from "supertest";

import app from "../../app";
import { signAccessToken } from "../../services/auth/TokenService";
import * as BrandService from "../../services/BrandService";
import { mockUserJwt } from "../../tests/mocks/auth";
import {
    mockBrand1,
    mockBrand2,
    mockBrandId,
    mockBrands,
} from "../../tests/mocks/brand";
import { mockDatabaseError } from "../../tests/mocks/error";

jest.mock("../../services/BrandService");

const request = supertest(app);

let token: string;

beforeAll(async () => {
    token = signAccessToken(mockUserJwt);
});

describe("BrandController", () => {
    describe("POST /api/brands", () => {
        it("should create a brand", async () => {
            jest.mocked(
                BrandService.createBrand as jest.Mock
            ).mockResolvedValue({ _id: mockBrandId });

            const response = await request
                .post("/api/brands")
                .set("Authorization", `Bearer ${token}`)
                .send(mockBrand1);

            expect(BrandService.createBrand).toHaveBeenCalledWith(mockBrand1);

            expect(response.statusCode).toBe(201);
            expect(response.body.id).toBe(mockBrandId);
            expect(response.body.message).toBe("Brand created successfully");
        });

        it("should return 500 if creating a brand fails", async () => {
            const mockCreateBrand = jest.spyOn(BrandService, "createBrand");
            mockCreateBrand.mockRejectedValue(mockDatabaseError);

            const response = await request
                .post("/api/brands")
                .set("Authorization", `Bearer ${token}`)
                .send(mockBrand1);

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("message");

            mockCreateBrand.mockRestore();
        });
    });

    describe("GET /api/brands", () => {
        it("should get all brands", async () => {
            jest.mocked(
                BrandService.getAllBrands as jest.Mock
            ).mockResolvedValue(mockBrands);

            const response = await request
                .get("/api/brands")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockBrands);
        });

        it("should return 500 if getting all brands fails", async () => {
            const mockGetAllBrands = jest.spyOn(BrandService, "getAllBrands");
            mockGetAllBrands.mockRejectedValue(mockDatabaseError);

            const response = await request
                .get("/api/brands")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("message");

            mockGetAllBrands.mockRestore();
        });
    });

    describe("PUT /api/brands/:id", () => {
        it("should update a brand", async () => {
            jest.mocked(
                BrandService.updateBrandById as jest.Mock
            ).mockResolvedValue({ _id: mockBrandId });

            const response = await request
                .put(`/api/brands/${mockBrandId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockBrand2);

            expect(BrandService.updateBrandById).toHaveBeenCalledWith(
                mockBrandId,
                mockBrand2
            );

            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(mockBrandId);
            expect(response.body.message).toBe("Brand updated successfully");
        });

        it("should return 500 if updating a brand fails", async () => {
            const mockUpdateBrandById = jest.spyOn(
                BrandService,
                "updateBrandById"
            );

            mockUpdateBrandById.mockRejectedValue(mockDatabaseError);

            const response = await request
                .put(`/api/brands/${mockBrandId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockBrand1);

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("message");

            mockUpdateBrandById.mockRestore();
        });
    });

    describe("DELETE /api/brands/:id", () => {
        it("should delete a brand", async () => {
            jest.mocked(
                BrandService.deleteBrandById as jest.Mock
            ).mockResolvedValue({ _id: mockBrandId });

            const response = await request
                .delete(`/api/brands/${mockBrandId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(BrandService.deleteBrandById).toHaveBeenCalledWith(
                mockBrandId
            );

            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(mockBrandId);
            expect(response.body.message).toBe("Brand deleted successfully");
        });

        it("should return 500 if deleting a brand fails", async () => {
            const mockDeleteBrandById = jest.spyOn(
                BrandService,
                "deleteBrandById"
            );

            mockDeleteBrandById.mockRejectedValue(mockDatabaseError);

            const response = await request
                .delete(`/api/brands/${mockBrandId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("message");

            mockDeleteBrandById.mockRestore();
        });
    });
});
