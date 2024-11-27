import mongoose, { Schema, Document } from "mongoose";

interface Product {
    name: string;
    image: string;
    buy: string;
}

interface ProductDocument extends Product, Document {}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        buy: { type: String, required: true },
    },
    { versionKey: false }
);

export default mongoose.model<ProductDocument>("Product", ProductSchema);
