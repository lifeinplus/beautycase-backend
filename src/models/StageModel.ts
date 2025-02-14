import mongoose, { Schema, Document } from "mongoose";

interface Stage {
    title: string;
    subtitle: string;
    imageId?: string;
    imageUrl: string;
    steps: string[];
    productIds: string[];
}

interface StageDocument extends Stage, Document {}

const StageSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        imageId: { type: String },
        imageUrl: { type: String, required: true },
        steps: { type: [String], required: true },
        productIds: {
            type: [Schema.Types.ObjectId],
            ref: "Product",
            required: true,
        },
    },
    {
        id: false,
        timestamps: true,
        toJSON: {
            transform: (_, ret) => {
                delete ret.productIds;
                return ret;
            },
            virtuals: true,
        },
        versionKey: false,
        virtuals: {
            products: {
                get() {
                    return this.productIds;
                },
            },
        },
    }
);

export default mongoose.model<StageDocument>("Stage", StageSchema);
