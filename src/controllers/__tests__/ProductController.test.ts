import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import * as ProductService from "../../services/ProductService";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockError } from "../../tests/mocks/error";
import {
    mockProduct1,
    mockProduct2,
    mockProductId,
} from "../../tests/mocks/product";

jest.mock("../../services/ProductService");

const request = supertest(app);
let token: string;

beforeAll(async () => {
    token = jwt.sign(
        { ...mockUserJwt },
        config.auth.accessToken.secret,
        config.auth.accessToken.options
    );
});

describe("ProductController", () => {
    describe("POST /api/products", () => {
        it("should create a product", async () => {
            jest.mocked(
                ProductService.createProduct as jest.Mock
            ).mockResolvedValue({ _id: mockProductId });

            const res = await request
                .post("/api/products")
                .set("Authorization", `Bearer ${token}`)
                .send(mockProduct2);

            expect(res.statusCode).toBe(201);

            expect(res.body).toEqual({
                id: mockProductId,
                message: "Product created successfully",
            });

            expect(ProductService.createProduct).toHaveBeenCalledWith(
                mockProduct2
            );
        });

        it("should return 500 if creating a product fails", async () => {
            const mockCreateProduct = jest.spyOn(
                ProductService,
                "createProduct"
            );

            mockCreateProduct.mockRejectedValue(mockError);

            const res = await request
                .post("/api/products")
                .set("Authorization", `Bearer ${token}`)
                .send(mockProduct2);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toEqual(mockError.message);

            expect(ProductService.createProduct).toHaveBeenCalledWith(
                mockProduct2
            );

            mockCreateProduct.mockRestore();
        });
    });

    describe("GET /api/products", () => {
        it("should get all products (imageUrl only)", async () => {
            const mockProducts = [mockProduct1, mockProduct2];

            jest.mocked(
                ProductService.getAllProducts as jest.Mock
            ).mockResolvedValue(mockProducts);

            const res = await request
                .get("/api/products")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockProducts);
            expect(ProductService.getAllProducts).toHaveBeenCalledTimes(1);
        });

        it("should return 500 if getting all products fails", async () => {
            const mockGetAllProducts = jest.spyOn(
                ProductService,
                "getAllProducts"
            );

            mockGetAllProducts.mockRejectedValue(mockError);

            const res = await request
                .get("/api/products")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toEqual(mockError.message);
            expect(ProductService.getAllProducts).toHaveBeenCalledTimes(1);

            mockGetAllProducts.mockRestore();
        });
    });

    describe("GET /api/products/:id", () => {
        it("should get a product", async () => {
            const mockResult = { _id: mockProductId, ...mockProduct1 };

            jest.mocked(
                ProductService.getProductById as jest.Mock
            ).mockResolvedValue(mockResult);

            const res = await request
                .get(`/api/products/${mockProductId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockResult);

            expect(ProductService.getProductById).toHaveBeenCalledTimes(1);
            expect(ProductService.getProductById).toHaveBeenCalledWith(
                mockProductId
            );
        });

        it("should return 500 if getting a product fails", async () => {
            const mockGetProductById = jest.spyOn(
                ProductService,
                "getProductById"
            );

            mockGetProductById.mockRejectedValue(mockError);

            const res = await request
                .get(`/api/products/${mockProductId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe(mockError.message);

            expect(ProductService.getProductById).toHaveBeenCalledWith(
                mockProductId
            );

            mockGetProductById.mockRestore();
        });
    });

    describe("PUT /api/products/:id", () => {
        it("should update a product", async () => {
            jest.mocked(
                ProductService.updateProductById as jest.Mock
            ).mockResolvedValue({ _id: mockProductId });

            const res = await request
                .put(`/api/products/${mockProductId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockProduct2);

            expect(res.statusCode).toBe(200);

            expect(res.body).toEqual({
                id: mockProductId,
                message: "Product updated successfully",
            });

            expect(ProductService.updateProductById).toHaveBeenCalledTimes(1);
            expect(ProductService.updateProductById).toHaveBeenCalledWith(
                mockProductId,
                mockProduct2
            );
        });

        it("should return 500 if updating a product fails", async () => {
            const mockUpdateProductById = jest.spyOn(
                ProductService,
                "updateProductById"
            );

            mockUpdateProductById.mockRejectedValue(mockError);

            const res = await request
                .put(`/api/products/${mockProductId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockProduct2);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe(mockError.message);

            expect(ProductService.updateProductById).toHaveBeenCalledWith(
                mockProductId,
                mockProduct2
            );

            mockUpdateProductById.mockRestore();
        });
    });

    describe("DELETE /api/products/:id", () => {
        it("should delete a product", async () => {
            jest.mocked(
                ProductService.deleteProductById as jest.Mock
            ).mockResolvedValue({ _id: mockProductId });

            const res = await request
                .delete(`/api/products/${mockProductId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);

            expect(res.body).toEqual({
                id: mockProductId,
                message: "Product deleted successfully",
            });

            expect(ProductService.deleteProductById).toHaveBeenCalledWith(
                mockProductId
            );
        });

        it("should return 500 if deleting a product fails", async () => {
            const mockDeleteProductById = jest.spyOn(
                ProductService,
                "deleteProductById"
            );

            mockDeleteProductById.mockRejectedValue(mockError);

            const res = await request
                .delete(`/api/products/${mockProductId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe(mockError.message);

            expect(ProductService.deleteProductById).toHaveBeenCalledWith(
                mockProductId
            );

            mockDeleteProductById.mockRestore();
        });
    });
});
