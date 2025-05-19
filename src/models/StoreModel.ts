import mongoose, { Schema, Document } from "mongoose";

export interface Store {
    name: string;
}

interface StoreDocument extends Store, Document {}

const StoreSchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    { versionKey: false }
);

export default mongoose.model<StoreDocument>("Store", StoreSchema);
