import mongoose, { Schema, Document } from "mongoose";

interface Brand {
    name: string;
    link: string;
    toolIds?: string[];
}

interface BrandDocument extends Brand, Document {}

const BrandSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        link: { type: String, required: true },
        toolIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tool" }],
    },
    { versionKey: false }
);

export default mongoose.model<BrandDocument>("Brand", BrandSchema);
