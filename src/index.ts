import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import config from "./config";
import Logging from "./library/Logging";
import { jwtVerifier, requestLogger } from "./middlewares";
import {
    AuthRoutes,
    BrandRoutes,
    ProductRoutes,
    StageRoutes,
    ToolRoutes,
} from "./routes";

const app = express();

mongoose
    .connect(config.mongoUri || "", { dbName: "beautycaseDB" })
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

    app.use("/api/auth", AuthRoutes);
    app.use(jwtVerifier);
    app.use("/api/brands", BrandRoutes);
    app.use("/api/products", ProductRoutes);
    app.use("/api/stages", StageRoutes);
    app.use("/api/tools", ToolRoutes);

    app.use((req, res, next) => {
        const error = new Error("URL not found");
        Logging.error(error);
        res.status(404).json({ message: error.message });
    });

    app.listen(config.port, async () => {
        Logging.info(`Server is running on http://localhost:${config.port}`);
    });
};
