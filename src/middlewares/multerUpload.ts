import multer from "multer";

const storage = multer.memoryStorage();

export const multerUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/heic"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid file type. Only JPEG, PNG, and HEIC are allowed."
                )
            );
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
