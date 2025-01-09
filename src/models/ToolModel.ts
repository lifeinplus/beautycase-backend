import mongoose, { Schema, Document } from "mongoose";

interface Tool {
    brandId: string;
    image: string;
    name: string;
    number?: string;
    comment?: string;
}

interface ToolDocument extends Tool, Document {}

const ToolSchema: Schema = new Schema(
    {
        brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        number: { type: String },
        comment: { type: String },
    },
    { versionKey: false }
);

export default mongoose.model<ToolDocument>("Tool", ToolSchema);
