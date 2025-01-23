import mongoose, { Schema, Document } from "mongoose";

interface Brand {
    name: string;
}

interface BrandDocument extends Brand, Document {}

const BrandSchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    { versionKey: false }
);

export default mongoose.model<BrandDocument>("Brand", BrandSchema);
