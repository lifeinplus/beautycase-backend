import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import config from "./config";
import { Logging } from "./library";
import {
    errorHandler,
    jwtVerifier,
    requestLogger,
    rolesVerifier,
} from "./middlewares";
import {
    AuthRoutes,
    BrandRoutes,
    CategoryRoutes,
    LessonRoutes,
    MakeupBagRoutes,
    ProductRoutes,
    QuestionnaireRoutes,
    StageRoutes,
    StoreRoutes,
    ToolRoutes,
    UploadRoutes,
    UserRoutes,
} from "./routes";
import { NotFoundError } from "./utils";

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
    app.use(cors(config.cors));
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("Beautycase API is running...");
    });

    app.use("/api/auth", AuthRoutes);
    app.use("/api/questionnaires", QuestionnaireRoutes);
    app.use(jwtVerifier);
    app.use(rolesVerifier(["admin", "mua", "client"]));
    app.use("/api/brands", BrandRoutes);
    app.use("/api/categories", CategoryRoutes);
    app.use("/api/lessons", LessonRoutes);
    app.use("/api/makeup-bags", MakeupBagRoutes);
    app.use("/api/products", ProductRoutes);
    app.use("/api/stages", StageRoutes);
    app.use("/api/stores", StoreRoutes);
    app.use("/api/tools", ToolRoutes);
    app.use("/api/uploads", UploadRoutes);
    app.use("/api/users", UserRoutes);

    app.use((req, res, next) => {
        next(new NotFoundError("URL not found"));
    });

    app.use(errorHandler);

    app.listen(config.port, async () => {
        Logging.info(`Server is running on http://localhost:${config.port}`);
    });
};
