import mongoose, { Document, Schema } from "mongoose";

interface User {
    creationDate: Date;
    password: string;
    refreshTokens: string[];
    username: string;
}

interface UserDocument extends User, Document {}

const UserSchema: Schema = new Schema(
    {
        creationDate: { type: Date, required: true },
        password: { type: String, required: true },
        refreshTokens: { type: [String] },
        username: { type: String, required: true, unique: true },
    },
    { versionKey: false }
);

export default mongoose.model<UserDocument>("User", UserSchema);
