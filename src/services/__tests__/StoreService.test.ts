import { mockStore1, mockStore2, mockStoreId } from "../../tests/mocks/store";
import { NotFoundError } from "../../utils/AppErrors";
import * as StoreService from "../StoreService";

describe("StoreService", () => {
    describe("createStore", () => {
        it("should create a store", async () => {
            const result = await StoreService.createStore(mockStore1);
            expect(result).toHaveProperty("_id");
            expect(result.name).toBe(mockStore1.name);
        });
    });

    describe("getAllStores", () => {
        it("should get all stores", async () => {
            await StoreService.createStore(mockStore1);
            await StoreService.createStore(mockStore2);

            const result = await StoreService.getAllStores();

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe(mockStore2.name);
            expect(result[1].name).toBe(mockStore1.name);
        });

        it("should throw NotFoundError if no stores exist", async () => {
            const result = StoreService.getAllStores();
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("updateStoreById", () => {
        it("should update a store", async () => {
            const store = await StoreService.createStore(mockStore1);

            const result = await StoreService.updateStoreById(
                String(store._id),
                mockStore2
            );

            expect(result.name).toBe(mockStore2.name);
        });

        it("should throw NotFoundError if store to update not found", async () => {
            const result = StoreService.updateStoreById(
                mockStoreId,
                mockStore2
            );

            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteStoreById", () => {
        it("should delete a store", async () => {
            const store = await StoreService.createStore(mockStore1);

            const result = await StoreService.deleteStoreById(
                String(store._id)
            );

            expect(result.name).toBe(mockStore1.name);
        });

        it("should throw NotFoundError if store to delete not found", async () => {
            const result = StoreService.deleteStoreById(mockStoreId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });
});
