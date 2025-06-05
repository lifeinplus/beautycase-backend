import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import StoreModel from "../../models/StoreModel";
import type { Store } from "../../models/StoreModel";
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

describe("StoreController", () => {
    const mockId = "682a378b09c4df2756fcece5";
    const mockStore1: Store = { name: "Sephora" };
    const mockStore2: Store = { name: "Cult Beauty" };

    describe("POST /api/stores", () => {
        it("should create a store", async () => {
            const res = await request
                .post("/api/stores")
                .set("Authorization", `Bearer ${token}`)
                .send(mockStore1);

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Store created successfully");

            const store = await StoreModel.findOne(mockStore1);
            expect(store).not.toBeNull();
        });

        it("should return 500 if creating a store fails", async () => {
            const mockCreate = jest.spyOn(StoreModel, "create");
            mockCreate.mockRejectedValue(mockError);

            const res = await request
                .post("/api/stores")
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Sephora" });

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty("message");

            mockCreate.mockRestore();
        });
    });

    describe("GET /api/stores", () => {
        it("should get all stores", async () => {
            await StoreModel.insertMany([mockStore1, mockStore2]);

            const res = await request
                .get("/api/stores")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });

        it("should return 404 if getting all stores fails", async () => {
            const res = await request
                .get("/api/stores")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Stores not found");
        });
    });

    describe("PUT /api/stores/:id", () => {
        it("should update a store", async () => {
            const store = await StoreModel.create(mockStore1);

            const res = await request
                .put(`/api/stores/${store._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockStore2);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Store updated successfully");

            const updated = await StoreModel.findById(store._id);
            expect(updated?.name).toBe(mockStore2.name);
        });

        it("should return 404 if updating a store fails", async () => {
            const res = await request
                .put(`/api/stores/${mockId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockStore1);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Store not found");
        });
    });

    describe("DELETE /api/stores/:id", () => {
        it("should delete a store", async () => {
            const store = await StoreModel.create(mockStore1);

            const res = await request
                .delete(`/api/stores/${store._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Store deleted successfully");

            const deleted = await StoreModel.findById(store._id);
            expect(deleted).toBeNull();
        });

        it("should return 404 if deleting a store fails", async () => {
            jest.spyOn(StoreModel, "findByIdAndDelete").mockRejectedValue(
                mockError
            );

            const res = await request
                .delete(`/api/stores/${mockId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
        });
    });
});
