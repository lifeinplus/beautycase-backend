import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import ProductModel from "../../models/ProductModel";
import type { Product } from "../../models/ProductModel";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockError } from "../../tests/mocks/error";

jest.mock("cloudinary", () => ({
    v2: {
        config: jest.fn(),
        uploader: {
            rename: jest.fn().mockResolvedValue({
                public_id: "products/renamed-id",
                secure_url: "https://cloudinary.com/renamed-image.jpg",
            }),
            explicit: jest.fn().mockResolvedValue({
                public_id: "products/renamed-id",
                secure_url: "https://cloudinary.com/renamed-image.jpg",
            }),
            destroy: jest.fn().mockResolvedValue({ result: "ok" }),
        },
    },
}));

jest.mock("../../services/tempUploadsService", () => ({
    get: jest.fn(() => "temp-id"),
    remove: jest.fn(),
}));

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
    const mockId = "682a378b09c4df2756fcece5";

    const mockProduct1: Product = {
        brandId: mockId,
        name: "Lipstick",
        imageUrl: "https://image.url/lipstick.png",
        comment: "Great product",
        storeLinks: [],
    };

    const mockProduct2: Product = {
        brandId: mockId,
        name: "Foundation",
        imageUrl: "https://image.url/foundation.png",
        comment: "Great product",
        storeLinks: [],
    };

    describe("createProduct", () => {
        it("should create a new product", async () => {
            const res = await request
                .post("/api/products")
                .set("Authorization", `Bearer ${token}`)
                .send(mockProduct1);

            expect(res.status).toBe(201);
            expect(res.body.count).toBe(1);
            expect(res.body.id).toBeDefined();
            expect(res.body.message).toBe("Product created successfully");

            const product = await ProductModel.findById(res.body.id);
            expect(product).not.toBeNull();
            expect(product?.imageId).toBe("products/renamed-id");
        });

        it("should return an error if product creation fails", async () => {
            const mockCreate = jest.spyOn(ProductModel, "create");
            mockCreate.mockRejectedValue(mockError);

            const res = await request
                .post("/api/products")
                .set("Authorization", `Bearer ${token}`)
                .send(mockProduct1)
                .expect(500);

            expect(res.body).toHaveProperty("message");
            mockCreate.mockRestore();
        });
    });

    describe("readProduct", () => {
        it("should read a single product", async () => {
            const product = await ProductModel.create(mockProduct1);

            const res = await request
                .get(`/api/products/${product._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.name).toBe(mockProduct1.name);
        });

        it("should return 404 if product not found", async () => {
            const res = await request
                .get(`/api/products/${mockId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Product not found");
        });
    });

    describe("readProducts", () => {
        it("should return all products (imageUrl only)", async () => {
            await ProductModel.insertMany([mockProduct1, mockProduct2]);

            const res = await request
                .get("/api/products")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0]).toHaveProperty("imageUrl");
            expect(res.body[0]).not.toHaveProperty("name");
        });

        it("should return 404 if no products found", async () => {
            const res = await request
                .get("/api/products")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Products not found");
        });
    });

    describe("updateProduct", () => {
        it("should update a product", async () => {
            const product = await ProductModel.create(mockProduct1);

            const res = await request
                .put(`/api/products/${product._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockProduct2);

            expect(res.status).toBe(200);
            expect(res.body.id).toBeDefined();
            expect(res.body.message).toBe("Product updated successfully");

            const updated = await ProductModel.findById(res.body.id);
            expect(updated?.name).toBe(mockProduct2.name);
        });

        it("should return 404 when updating a non-existent product", async () => {
            const res = await request
                .put(`/api/products/${mockId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockProduct1);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Product not found");
        });
    });

    describe("deleteProduct", () => {
        it("should delete a product", async () => {
            const product = await ProductModel.create({
                ...mockProduct1,
                imageId: "products/renamed-id",
            });

            const res = await request
                .delete(`/api/products/${product._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.id).toBeUndefined();
            expect(res.body.message).toBe("Product deleted successfully");

            const deleted = await ProductModel.findById(product._id);
            expect(deleted).toBeNull();
        });

        it("should return 404 when deleting a non-existent product", async () => {
            const res = await request
                .delete(`/api/products/${mockId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Product not found");
        });
    });
});
