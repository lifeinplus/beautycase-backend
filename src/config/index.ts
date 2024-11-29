import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const config = {
    mongoUri: process.env.MONGO_URI,
    port: process.env.PORT || 3000,
};

export default config;
