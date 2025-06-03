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

    describe("createStore", () => {
        it("should create a store", async () => {
            const res = await request
                .post("/api/stores")
                .set("Authorization", `Bearer ${token}`)
                .send(mockStore1)
                .expect(201);

            expect(res.body.message).toBe("Store created successfully");

            const store = await StoreModel.findOne(mockStore1);
            expect(store).not.toBeNull();
        });

        it("should return an error if store creation fails", async () => {
            const mockCreate = jest.spyOn(StoreModel, "create");
            mockCreate.mockRejectedValue(mockError);

            const res = await request
                .post("/api/stores")
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Sephora" })
                .expect(500);

            expect(res.body).toHaveProperty("message");
            mockCreate.mockRestore();
        });
    });

    describe("getAllStores", () => {
        it("should get all stores", async () => {
            await StoreModel.insertMany([mockStore1, mockStore2]);

            const res = await request
                .get("/api/stores")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(res.body.length).toBe(2);
        });

        it("should return 404 when no stores exist", async () => {
            const res = await request
                .get("/api/stores")
                .set("Authorization", `Bearer ${token}`)
                .expect(404);

            expect(res.body.message).toBe("Stores not found");
        });
    });

    describe("updateStoreById", () => {
        it("should update a store", async () => {
            const store = await StoreModel.create(mockStore1);

            const res = await request
                .put(`/api/stores/${store._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockStore2)
                .expect(200);

            expect(res.body.message).toBe("Store updated successfully");

            const updated = await StoreModel.findById(store._id);
            expect(updated?.name).toBe(mockStore2.name);
        });

        it("should return 404 when updating a non-existent store", async () => {
            const res = await request
                .put(`/api/stores/${mockId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockStore1)
                .expect(404);

            expect(res.body.message).toBe("Store not found");
        });
    });

    describe("deleteStoreById", () => {
        it("should delete a store", async () => {
            const store = await StoreModel.create(mockStore1);

            const res = await request
                .delete(`/api/stores/${store._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(res.body.message).toBe("Store deleted successfully");

            const deleted = await StoreModel.findById(store._id);
            expect(deleted).toBeNull();
        });

        it("should handle errors during store deletion", async () => {
            jest.spyOn(StoreModel, "findByIdAndDelete").mockRejectedValue(
                mockError
            );

            await request
                .delete(`/api/stores/${mockId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(500);
        });
    });
});
