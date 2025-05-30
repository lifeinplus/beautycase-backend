import mongoose, { Schema, Document } from "mongoose";

export interface Stage {
    title: string;
    subtitle: string;
    imageId?: string;
    imageUrl: string;
    comment?: string;
    steps?: string[];
    productIds: string[];
}

export interface StageDocument extends Stage, Document {}

const StageSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        imageId: { type: String },
        imageUrl: { type: String, required: true },
        comment: { type: String },
        steps: { type: [String] },
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
