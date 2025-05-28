import UserModel from "../../models/UserModel";
import { filterRefreshTokens } from "./TokenService";

export const logout = async (
    existingRefreshToken: string
): Promise<boolean> => {
    const foundUser = await UserModel.findOne({
        refreshTokens: existingRefreshToken,
    }).exec();

    if (!foundUser) {
        return false;
    }

    foundUser.refreshTokens = filterRefreshTokens(
        foundUser.refreshTokens,
        existingRefreshToken
    );

    await foundUser.save();

    return true;
};
