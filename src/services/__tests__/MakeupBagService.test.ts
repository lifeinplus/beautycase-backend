import {
    mockBrand,
    mockCategory,
    mockMakeupBagId,
    mockMakeupBag1,
    mockMakeupBag2,
    mockProduct,
    mockStage,
    mockTool,
    mockUser,
} from "../../tests/mocks/makeupBag";
import { NotFoundError } from "../../utils/AppErrors";
import * as BrandService from "../BrandService";
import * as CategoryService from "../CategoryService";
import * as MakeupBagService from "../MakeupBagService";
import * as ProductService from "../ProductService";
import * as RegisterService from "../auth/RegisterService";
import * as StageService from "../StageService";
import * as ToolService from "../ToolService";
import * as UserService from "../UserService";

describe("MakeupBagService", () => {
    describe("createMakeupBag", () => {
        it("should create a makeup bag", async () => {
            const makeupBag = await MakeupBagService.createMakeupBag(
                mockMakeupBag1
            );

            expect(makeupBag).toHaveProperty("_id");
            expect(String(makeupBag.categoryId)).toBe(
                mockMakeupBag1.categoryId
            );
            expect(String(makeupBag.clientId)).toBe(mockMakeupBag1.clientId);
        });
    });

    describe("getAllMakeupBags", () => {
        it("should get all makeupBags", async () => {
            const category = await CategoryService.createCategory(mockCategory);
            const stage = await StageService.createStage(mockStage);

            await RegisterService.registerUser(mockUser);
            const users = await UserService.getAllUsers();
            const user = users.find((u) => u.username === mockUser.username);

            await MakeupBagService.createMakeupBag({
                ...mockMakeupBag1,
                categoryId: String(category._id),
                clientId: String(user?._id),
                stageIds: [String(stage._id)],
            });

            const makeupBags = await MakeupBagService.getAllMakeupBags();

            expect(makeupBags).toHaveLength(1);
            expect(makeupBags[0]).toHaveProperty("categoryId");
            expect(makeupBags[0]).toHaveProperty("clientId");
            expect(makeupBags[0]).toHaveProperty("createdAt");
            expect(makeupBags[0]).toHaveProperty("stageIds");
        });

        it("should throw NotFoundError if no makeupBags found", async () => {
            const makeupBagPromise = MakeupBagService.getAllMakeupBags();
            await expect(makeupBagPromise).rejects.toThrow(NotFoundError);
        });
    });

    describe("getMakeupBagById", () => {
        it("should get a makeup bag", async () => {
            const category = await CategoryService.createCategory(mockCategory);

            await RegisterService.registerUser(mockUser);
            const users = await UserService.getAllUsers();
            const user = users.find((u) => u.username === mockUser.username);

            const product = await ProductService.createProduct(mockProduct);
            const stage = await StageService.createStage({
                ...mockStage,
                productIds: [String(product._id)],
            });

            const brand = await BrandService.createBrand(mockBrand);
            const tool = await ToolService.createTool({
                ...mockTool,
                brandId: String(brand._id),
            });

            const makeupBag = await MakeupBagService.createMakeupBag({
                ...mockMakeupBag1,
                categoryId: String(category._id),
                clientId: String(user?._id),
                stageIds: [String(stage._id)],
                toolIds: [String(tool._id)],
            });

            const result = await MakeupBagService.getMakeupBagById(
                String(makeupBag._id)
            );

            expect(result._id).toEqual(makeupBag._id);
            expect(result).toHaveProperty("categoryId");
            expect(result).toHaveProperty("clientId");
            expect(result).toHaveProperty("createdAt");
            expect(result).toHaveProperty("stageIds");
        });

        it("should throw NotFoundError if makeupBag not found", async () => {
            const makeupBagPromise =
                MakeupBagService.getMakeupBagById(mockMakeupBagId);
            await expect(makeupBagPromise).rejects.toThrow(NotFoundError);
        });
    });

    describe("getMakeupBagsByClientId", () => {
        it("should get makeup bags by clientId", async () => {
            const category = await CategoryService.createCategory(mockCategory);

            await RegisterService.registerUser(mockUser);
            const users = await UserService.getAllUsers();
            const user = users.find((u) => u.username === mockUser.username);

            await MakeupBagService.createMakeupBag({
                categoryId: String(category._id),
                clientId: String(user?._id),
                stageIds: [],
                toolIds: [],
            });

            const result = await MakeupBagService.getMakeupBagsByClientId(
                String(user?._id)
            );

            expect(result).toHaveLength(1);
        });
    });

    describe("updateMakeupBagById", () => {
        it("should update a makeup bag", async () => {
            const makeupBag = await MakeupBagService.createMakeupBag(
                mockMakeupBag1
            );

            const updated = await MakeupBagService.updateMakeupBagById(
                String(makeupBag._id),
                mockMakeupBag2
            );

            expect(String(updated.categoryId)).toBe(mockMakeupBag2.categoryId);
        });

        it("should throw NotFoundError if makeupBag to update not found ", async () => {
            const makeupBagPromise = MakeupBagService.updateMakeupBagById(
                mockMakeupBagId,
                mockMakeupBag2
            );

            await expect(makeupBagPromise).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteMakeupBagById", () => {
        it("should delete a makeup bag", async () => {
            const makeupBag = await MakeupBagService.createMakeupBag(
                mockMakeupBag1
            );

            const deleted = await MakeupBagService.deleteMakeupBagById(
                String(makeupBag._id)
            );

            expect(String(deleted.categoryId)).toBe(mockMakeupBag1.categoryId);
        });

        it("should throw NotFoundError if makeupBag to delete not found", async () => {
            const makeupBagPromise =
                MakeupBagService.deleteMakeupBagById(mockMakeupBagId);
            await expect(makeupBagPromise).rejects.toThrow(NotFoundError);
        });
    });
});
