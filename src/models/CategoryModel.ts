import mongoose, { Schema, Document } from "mongoose";

export interface Category {
    name: string;
    type: string;
}

export interface CategoryDocument extends Category, Document {}

const CategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },
    },
    { versionKey: false }
);

export default mongoose.model<CategoryDocument>("Category", CategorySchema);
