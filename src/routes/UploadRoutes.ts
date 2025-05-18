import express from "express";

import { uploadImageTemp } from "../controllers/UploadController";
import multerUpload from "../middlewares/multerUpload";
import requestValidator from "../middlewares/requestValidator";
import { uploadBodySchema } from "../validations/uploadSchema";

const router = express.Router();

router.post(
    "/image-temp",
    multerUpload.single("imageFile"),
    requestValidator({ body: uploadBodySchema }),
    uploadImageTemp
);

export default router;
