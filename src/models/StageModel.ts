import mongoose, { Schema, Document } from "mongoose";

interface Stage {
    title: string;
    subtitle: string;
    image: string;
    steps: string[];
    productIds: string[];
}

interface StageDocument extends Stage, Document {}

const StageSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        image: { type: String, required: true },
        steps: { type: [String], required: true },
        productIds: {
            type: [Schema.Types.ObjectId],
            ref: "Product",
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);

StageSchema.virtual("products").get(function () {
    return this.productIds;
});

StageSchema.set("toJSON", {
    virtuals: true,
    transform: (_, ret) => {
        delete ret.productIds;
        return ret;
    },
});

export default mongoose.model<StageDocument>("Stage", StageSchema);
