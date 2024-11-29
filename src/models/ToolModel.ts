import mongoose, { Schema, Document } from "mongoose";

interface Tool {
    image: string;
    name: string;
    number?: string;
    comment?: string;
}

interface ToolDocument extends Tool, Document {}

const ToolSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        number: { type: String },
        comment: { type: String },
    },
    { versionKey: false }
);

export default mongoose.model<ToolDocument>("Tool", ToolSchema);
