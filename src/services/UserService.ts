import UserModel from "../models/UserModel";
import { NotFoundError } from "../utils/AppErrors";
import { getLessonsByClientId } from "./LessonService";
import { getMakeupBagsByClientId } from "./MakeupBagService";

export const getAllUsers = async () => {
    const users = await UserModel.find().select("_id username");

    if (!users.length) {
        throw new NotFoundError("Users not found");
    }

    return users;
};

export const getUserById = async (id: string) => {
    const user = await UserModel.findById(id).select("role username");

    if (!user) {
        throw new NotFoundError("User not found");
    }

    const makeupBags = await getMakeupBagsByClientId(id);
    const lessons = await getLessonsByClientId(id);

    return { user, makeupBags, lessons };
};
