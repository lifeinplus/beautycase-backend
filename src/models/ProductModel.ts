import mongoose, { Schema, Document } from "mongoose";

interface Store {
    name: string;
    link: string;
}

interface Product {
    name: string;
    brandId: string;
    image: string;
    stores: Store[];
}

interface ProductDocument extends Product, Document {}

const StoreSchema = new Schema<Store>({
    name: { type: String, required: true },
    link: { type: String, required: true },
});

const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
        image: { type: String, required: true },
        stores: { type: [StoreSchema], required: true },
    },
    { versionKey: false }
);

export default mongoose.model<ProductDocument>("Product", ProductSchema);
