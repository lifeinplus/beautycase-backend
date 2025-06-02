import mongoose, { Document, Schema } from "mongoose";

export interface User {
    password: string;
    refreshTokens: string[];
    role: "admin" | "client" | "mua";
    username: string;
}

export interface UserDocument extends User, Document {}

const UserSchema: Schema = new Schema(
    {
        password: { type: String, required: true },
        refreshTokens: { type: [String] },
        role: {
            type: String,
            enum: ["admin", "client", "mua"],
            required: true,
        },
        username: { type: String, required: true, unique: true },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model<UserDocument>("User", UserSchema);
