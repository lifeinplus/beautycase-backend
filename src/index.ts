import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import Logging from "./library/Logging";
import { requestLogger } from "./middleware";
import { ProductRoutes } from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI || "", { dbName: "beautycaseDB" })
    .then(() => {
        Logging.info("Server connected to MongoDB");
        StartServer();
    })
    .catch((error) => {
        Logging.error("Unable to connect to MongoDB:");
        Logging.error(error);
    });

const StartServer = () => {
    app.use(requestLogger);
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("Beautycase API is running...");
    });

    app.use("/api/products", ProductRoutes);

    app.use((req, res, next) => {
        const error = new Error("URL not found");
        Logging.error(error);
        res.status(404).json({ message: error.message });
    });

    app.listen(PORT, async () => {
        Logging.info(`Server is running on http://localhost:${PORT}`);
    });
};
