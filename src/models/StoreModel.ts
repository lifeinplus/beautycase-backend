import mongoose, { Schema, Document } from "mongoose";

interface Store {
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
