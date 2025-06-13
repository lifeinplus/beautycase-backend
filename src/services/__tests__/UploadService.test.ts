import { v2 as cloudinary } from "cloudinary";

import { BadRequestError } from "../../utils/AppErrors";
import { uploadTempImageByFile } from "../UploadService";
import tempUploadsService from "../tempUploadsService";

jest.mock("cloudinary");
jest.mock("../tempUploadsService");

const mockCloudinary = cloudinary as jest.Mocked<typeof cloudinary>;

const mockTempUploadsService = tempUploadsService as jest.Mocked<
    typeof tempUploadsService
>;

describe("uploadImageTemp", () => {
    const mockFolder = "test-folder";

    const mockCloudinaryResponse = {
        public_id: "test-folder/temp/abc123",
        secure_url: "https://cdn.com/testfile.png",
    };

    const mockFile: Express.Multer.File = {
        buffer: Buffer.from("test-image-data"),
        mimetype: "image/jpeg",
        fieldname: "image",
        originalname: "test-image.jpg",
        encoding: "7bit",
        size: 1024,
        destination: "",
        filename: "",
        path: "",
        stream: {} as any,
    };

    it("should successfully upload an image and return secure URL", async () => {
        mockCloudinary.uploader.upload = jest
            .fn()
            .mockResolvedValue(mockCloudinaryResponse);

        const result = await uploadTempImageByFile(mockFolder, mockFile);

        expect(result).toBe(mockCloudinaryResponse.secure_url);
        expect(mockCloudinary.uploader.upload).toHaveBeenCalled();
        expect(mockTempUploadsService.store).toHaveBeenCalledWith(
            mockCloudinaryResponse.secure_url,
            mockCloudinaryResponse.public_id
        );
    });

    it("should throw BadRequestError if no file is provided", async () => {
        const result = uploadTempImageByFile(mockFolder);
        await expect(result).rejects.toThrow(BadRequestError);
        expect(mockCloudinary.uploader.upload).not.toHaveBeenCalled();
        expect(mockTempUploadsService.store).not.toHaveBeenCalled();
    });
});
