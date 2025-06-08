import { mockBrand1 } from "../../tests/mocks/brand";
import { mockCategory1 } from "../../tests/mocks/category";
import {
    mockMakeupBagId,
    mockMakeupBag1,
    mockMakeupBag2,
} from "../../tests/mocks/makeupBag";
import { mockProduct1 } from "../../tests/mocks/product";
import { mockStage1 } from "../../tests/mocks/stage";
import { mockTool1 } from "../../tests/mocks/tool";
import { mockUser1 } from "../../tests/mocks/user";
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
            const result = await MakeupBagService.createMakeupBag(
                mockMakeupBag1
            );

            expect(result).toHaveProperty("_id");
            expect(String(result.categoryId)).toBe(mockMakeupBag1.categoryId);
            expect(String(result.clientId)).toBe(mockMakeupBag1.clientId);
        });
    });

    describe("getAllMakeupBags", () => {
        it("should get all makeup bags", async () => {
            const category = await CategoryService.createCategory(
                mockCategory1
            );

            const stage = await StageService.createStage(mockStage1);

            await RegisterService.registerUser(mockUser1);
            const users = await UserService.getAllUsers();
            const user = users.find((u) => u.username === mockUser1.username);

            await MakeupBagService.createMakeupBag({
                ...mockMakeupBag1,
                categoryId: String(category._id),
                clientId: String(user?._id),
                stageIds: [String(stage._id)],
            });

            const result = await MakeupBagService.getAllMakeupBags();

            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty("categoryId");
            expect(result[0]).toHaveProperty("clientId");
            expect(result[0]).toHaveProperty("createdAt");
            expect(result[0]).toHaveProperty("stageIds");
        });

        it("should throw NotFoundError if no makeup bags found", async () => {
            const result = MakeupBagService.getAllMakeupBags();
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("getMakeupBagById", () => {
        it("should get a makeup bag", async () => {
            const category = await CategoryService.createCategory(
                mockCategory1
            );

            await RegisterService.registerUser(mockUser1);
            const users = await UserService.getAllUsers();
            const user = users.find((u) => u.username === mockUser1.username);

            const product = await ProductService.createProduct(mockProduct1);
            const stage = await StageService.createStage({
                ...mockStage1,
                productIds: [String(product._id)],
            });

            const brand = await BrandService.createBrand(mockBrand1);
            const tool = await ToolService.createTool({
                ...mockTool1,
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
            const result = MakeupBagService.getMakeupBagById(mockMakeupBagId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("getMakeupBagsByClientId", () => {
        it("should get makeup bags by clientId", async () => {
            const category = await CategoryService.createCategory(
                mockCategory1
            );

            await RegisterService.registerUser(mockUser1);
            const users = await UserService.getAllUsers();
            const user = users.find((u) => u.username === mockUser1.username);

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

            const result = await MakeupBagService.updateMakeupBagById(
                String(makeupBag._id),
                mockMakeupBag2
            );

            expect(String(result.categoryId)).toBe(mockMakeupBag2.categoryId);
        });

        it("should throw NotFoundError if makeupBag to update not found ", async () => {
            const result = MakeupBagService.updateMakeupBagById(
                mockMakeupBagId,
                mockMakeupBag2
            );

            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteMakeupBagById", () => {
        it("should delete a makeup bag", async () => {
            const makeupBag = await MakeupBagService.createMakeupBag(
                mockMakeupBag1
            );

            const result = await MakeupBagService.deleteMakeupBagById(
                String(makeupBag._id)
            );

            expect(String(result.categoryId)).toBe(mockMakeupBag1.categoryId);
        });

        it("should throw NotFoundError if makeupBag to delete not found", async () => {
            const result =
                MakeupBagService.deleteMakeupBagById(mockMakeupBagId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });
});
