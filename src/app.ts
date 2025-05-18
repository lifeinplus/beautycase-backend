import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import config from "./config";
import errorHandler from "./middlewares/errorHandler";
import jwtVerifier from "./middlewares/jwtVerifier";
import requestLogger from "./middlewares/requestLogger";
import rolesVerifier from "./middlewares/rolesVerifier";
import AuthRoutes from "./routes/AuthRoutes";
import BrandRoutes from "./routes/BrandRoutes";
import CategoryRoutes from "./routes/CategoryRoutes";
import LessonRoutes from "./routes/LessonRoutes";
import MakeupBagRoutes from "./routes/MakeupBagRoutes";
import ProductRoutes from "./routes/ProductRoutes";
import QuestionnaireRoutes from "./routes/QuestionnaireRoutes";
import StageRoutes from "./routes/StageRoutes";
import StoreRoutes from "./routes/StoreRoutes";
import ToolRoutes from "./routes/ToolRoutes";
import UploadRoutes from "./routes/UploadRoutes";
import UserRoutes from "./routes/UserRoutes";
import { NotFoundError } from "./utils/AppErrors";

const app = express();

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
app.use("/api/uploads", UploadRoutes);
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
app.use("/api/users", UserRoutes);

app.use((req, res, next) => {
    next(new NotFoundError("URL not found"));
});

app.use(errorHandler);

export default app;
