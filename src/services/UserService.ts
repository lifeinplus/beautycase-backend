import UserModel from "../models/UserModel";
import { NotFoundError } from "../utils/AppErrors";
import { readMakeupBagsByClientId } from "./MakeupBagService";

export const readUserWithMakeupBags = async (id: string) => {
    const user = await UserModel.findById(id).select("role username");

    if (!user) {
        throw new NotFoundError("User not found");
    }

    const makeupBags = await readMakeupBagsByClientId(id);

    return { user, makeupBags };
};

export const readUsers = async () => {
    const users = await UserModel.find().select("_id username");

    if (!users.length) {
        throw new NotFoundError("Users not found");
    }

    return users;
};
