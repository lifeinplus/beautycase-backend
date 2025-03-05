import express from "express";

import { uploadImageTemp } from "../controllers/UploadController";
import { multerUpload, requestValidator } from "../middlewares";
import { uploadBodySchema } from "../validations";

const router = express.Router();

router.post(
    "/image-temp",
    multerUpload.single("imageFile"),
    requestValidator({ body: uploadBodySchema }),
    uploadImageTemp
);

export default router;
