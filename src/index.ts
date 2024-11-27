import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import productRoutes from "./routes/products";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Beautycase API is running...");
});

app.use("/products", productRoutes);

app.listen(PORT, async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "", {
            dbName: "beautycaseDB",
        });
        console.log(`Connected to MongoDB`);
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
});
