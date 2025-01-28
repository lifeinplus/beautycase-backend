import mongoose, { Document, Schema } from "mongoose";

interface Lesson {
    title: string;
    shortDescription: string;
    videoUrl: string;
    fullDescription: string;
    productIds: string[];
}

interface LessonDocument extends Lesson, Document {}

const LessonSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        videoUrl: { type: String, required: true },
        fullDescription: { type: String, required: true },
        productIds: {
            type: [Schema.Types.ObjectId],
            ref: "Product",
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);

LessonSchema.virtual("products").get(function () {
    return this.productIds;
});

LessonSchema.set("toJSON", {
    virtuals: true,
    transform: (_, ret) => {
        delete ret.productIds;
        return ret;
    },
});

export default mongoose.model<LessonDocument>("Lesson", LessonSchema);
