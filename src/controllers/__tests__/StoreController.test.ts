import jwt from "jsonwebtoken";
import supertest from "supertest";

import app from "../../app";
import config from "../../config";
import * as StoreService from "../../services/StoreService";
import { mockUserJwt } from "../../tests/mocks/auth";
import { mockStore1, mockStore2, mockStoreId } from "../../tests/mocks/store";
import { mockError } from "../../tests/mocks/error";

jest.mock("../../services/StoreService");

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
    describe("POST /api/stores", () => {
        it("should create a store", async () => {
            jest.mocked(
                StoreService.createStore as jest.Mock
            ).mockResolvedValue({ _id: mockStoreId });

            const res = await request
                .post("/api/stores")
                .set("Authorization", `Bearer ${token}`)
                .send(mockStore1);

            expect(StoreService.createStore).toHaveBeenCalledWith(mockStore1);

            expect(res.statusCode).toBe(201);
            expect(res.body.id).toBe(mockStoreId);
            expect(res.body.message).toBe("Store created successfully");
        });

        it("should return 500 if creating a store fails", async () => {
            const mockCreateStore = jest.spyOn(StoreService, "createStore");
            mockCreateStore.mockRejectedValue(mockError);

            const res = await request
                .post("/api/stores")
                .set("Authorization", `Bearer ${token}`)
                .send(mockStore1);

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty("message");

            mockCreateStore.mockRestore();
        });
    });

    describe("GET /api/stores", () => {
        it("should get all stores", async () => {
            const mockStores = [mockStore1, mockStore2];

            jest.mocked(
                StoreService.getAllStores as jest.Mock
            ).mockResolvedValue(mockStores);

            const res = await request
                .get("/api/stores")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockStores);
        });

        it("should return 500 if getting all stores fails", async () => {
            const mockGetAllStores = jest.spyOn(StoreService, "getAllStores");
            mockGetAllStores.mockRejectedValue(mockError);

            const res = await request
                .get("/api/stores")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty("message");

            mockGetAllStores.mockRestore();
        });
    });

    describe("PUT /api/stores/:id", () => {
        it("should update a store", async () => {
            jest.mocked(
                StoreService.updateStoreById as jest.Mock
            ).mockResolvedValue({ _id: mockStoreId });

            const res = await request
                .put(`/api/stores/${mockStoreId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockStore2);

            expect(StoreService.updateStoreById).toHaveBeenCalledWith(
                mockStoreId,
                mockStore2
            );

            expect(res.statusCode).toBe(200);
            expect(res.body.id).toBe(mockStoreId);
            expect(res.body.message).toBe("Store updated successfully");
        });

        it("should return 500 if updating a store fails", async () => {
            const mockUpdateStoreById = jest.spyOn(
                StoreService,
                "updateStoreById"
            );

            mockUpdateStoreById.mockRejectedValue(mockError);

            const res = await request
                .put(`/api/stores/${mockStoreId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mockStore1);

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty("message");

            mockUpdateStoreById.mockRestore();
        });
    });

    describe("DELETE /api/stores/:id", () => {
        it("should delete a store", async () => {
            jest.mocked(
                StoreService.deleteStoreById as jest.Mock
            ).mockResolvedValue({ _id: mockStoreId });

            const res = await request
                .delete(`/api/stores/${mockStoreId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(StoreService.deleteStoreById).toHaveBeenCalledWith(
                mockStoreId
            );

            expect(res.statusCode).toBe(200);
            expect(res.body.id).toBe(mockStoreId);
            expect(res.body.message).toBe("Store deleted successfully");
        });

        it("should return 500 if deleting a store fails", async () => {
            const mockDeleteStoreById = jest.spyOn(
                StoreService,
                "deleteStoreById"
            );

            mockDeleteStoreById.mockRejectedValue(mockError);

            const res = await request
                .delete(`/api/stores/${mockStoreId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty("message");

            mockDeleteStoreById.mockRestore();
        });
    });
});
