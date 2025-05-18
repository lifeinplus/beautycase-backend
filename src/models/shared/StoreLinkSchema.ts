import { Schema } from "mongoose";

export interface StoreLink {
    name: string;
    link: string;
}

const StoreLinkSchema = new Schema<StoreLink>({
    name: { type: String, required: true },
    link: { type: String, required: true },
});

export default StoreLinkSchema;
