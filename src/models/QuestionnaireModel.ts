import mongoose, { Document, Schema } from "mongoose";

interface Questionnaire {
    name: string;
    instagram: string;
    city?: string;
    age?: number;
    makeupBag: string;
    procedures?: {
        lashExtensions: boolean;
        browCorrection: boolean;
        lashLamination: boolean;
        none: boolean;
    };
    skinType?: string;
    allergies?: string;
    peeling?: boolean;
    pores?: string;
    oilyShine?: string;
    currentSkills?: string;
    desiredSkills?: string;
    makeupTime?: string;
    budget?: string;
    brushes?: boolean;
    problems?: {
        eyeshadowCrease: boolean;
        mascaraSmudge: boolean;
        foundationPores: boolean;
        foundationStay: boolean;
        sculpting: boolean;
        eyeshadowMatch: boolean;
        other: string;
    };
    referral?: string;
}

interface QuestionnaireDocument extends Questionnaire, Document {}

const QuestionnaireSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        instagram: { type: String, required: true },
        city: { type: String },
        age: { type: Number },
        makeupBag: { type: String, required: true },
        procedures: {
            lashExtensions: { type: Boolean },
            browCorrection: { type: Boolean },
            lashLamination: { type: Boolean },
            none: { type: Boolean },
        },
        skinType: { type: String },
        allergies: { type: String },
        peeling: { type: Boolean },
        pores: { type: Boolean },
        oilyShine: { type: Boolean },
        currentSkills: { type: String },
        desiredSkills: { type: String },
        makeupTime: {
            type: String,
            enum: ["до 15 минут", "15-25 минут", "30-60 минут"],
        },
        budget: {
            type: String,
            enum: [
                "до 3 тыс. рублей",
                "до 5 тыс. рублей",
                "до 10 тыс. рублей",
                "более 10 тыс. рублей",
            ],
        },
        brushes: { type: Boolean },
        problems: {
            eyeshadowCrease: { type: Boolean },
            mascaraSmudge: { type: Boolean },
            foundationPores: { type: Boolean },
            foundationStay: { type: Boolean },
            sculpting: { type: Boolean },
            eyeshadowMatch: { type: Boolean },
            other: { type: String },
        },
        referral: {
            type: String,
            enum: ["Инстаграм", "Ютуб", "Другое"],
        },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model<QuestionnaireDocument>(
    "Questionnaire",
    QuestionnaireSchema
);
