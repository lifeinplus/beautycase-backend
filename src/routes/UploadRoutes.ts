import express from "express";

import {
    uploadTempImageByFile,
    uploadTempImageByUrl,
} from "../controllers/UploadController";
import multerUpload from "../middlewares/multerUpload";
import requestValidator from "../middlewares/requestValidator";
import {
    uploadFileBodySchema,
    uploadUrlBodySchema,
} from "../validations/uploadSchema";

const router = express.Router();

router.post(
    "/temp-image-file",
    multerUpload.single("imageFile"),
    requestValidator({ body: uploadFileBodySchema }),
    uploadTempImageByFile
);

router.post(
    "/temp-image-url",
    requestValidator({ body: uploadUrlBodySchema }),
    uploadTempImageByUrl
);

export default router;
