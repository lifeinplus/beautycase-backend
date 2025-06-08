import { mockMakeupBag1 } from "../../tests/mocks/makeupBag";
import { mockUser1, mockUser2, mockUserId } from "../../tests/mocks/user";
import { NotFoundError } from "../../utils/AppErrors";
import * as RegisterService from "../auth/RegisterService";
import * as MakeupBagService from "../MakeupBagService";
import * as UserService from "../UserService";

jest.mock("../MakeupBagService");

describe("UserService", () => {
    describe("getAllUsers", () => {
        it("should get all users (_id and username only)", async () => {
            await RegisterService.registerUser(mockUser1);
            await RegisterService.registerUser(mockUser2);

            const result = await UserService.getAllUsers();

            expect(result).toHaveLength(2);
            expect(result[0]).toHaveProperty("_id");
            expect(result[0]).toHaveProperty("username");
            expect(result[0].password).toBeUndefined();
        });

        it("should throw NotFoundError if no users found", async () => {
            const result = UserService.getAllUsers();
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });

    describe("getUserById", () => {
        it("should get a user with role, username, and makeup bags", async () => {
            jest.mocked(
                MakeupBagService.getMakeupBagsByClientId as jest.Mock
            ).mockResolvedValue([mockMakeupBag1]);

            await RegisterService.registerUser(mockUser1);
            const users = await UserService.getAllUsers();
            const user = users.find((u) => u.username === mockUser1.username);

            const result = await UserService.getUserById(String(user?._id));

            expect(result).toHaveProperty("user");
            expect(result).toHaveProperty("makeupBags");

            expect(result.user._id).toEqual(user?._id);
            expect(result.user.role).toBe(mockUser1.role);
            expect(result.user.username).toBe(mockUser1.username);
            expect(result.user.password).toBeUndefined();

            expect(result.makeupBags).toEqual([mockMakeupBag1]);

            expect(
                MakeupBagService.getMakeupBagsByClientId
            ).toHaveBeenCalledWith(String(user?._id));
        });

        it("should throw NotFoundError if user not found", async () => {
            const result = UserService.getUserById(mockUserId);
            await expect(result).rejects.toThrow(NotFoundError);
        });
    });
});
