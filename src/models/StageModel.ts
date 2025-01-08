import mongoose, { Schema, Document } from "mongoose";

interface Stage {
    title: string;
    subtitle: string;
    image: string;
    steps: string[];
    productIds?: string[];
}

interface StageDocument extends Stage, Document {}

const StageSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        image: { type: String, required: true },
        steps: { type: [String], required: true },
        productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model<StageDocument>("Stage", StageSchema);
