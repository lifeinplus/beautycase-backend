import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    image: string;
    buy: string;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    buy: { type: String, required: true },
});

export default mongoose.model<IProduct>("Product", ProductSchema);
