import { v2 as cloudinary } from "cloudinary";

import { mockCloudinaryError } from "../../tests/mocks/error";
import {
    mockCloudinaryResponse,
    mockFile,
    mockFolder,
    mockImageUrl1,
} from "../../tests/mocks/upload";
import { BadRequestError } from "../../utils/AppErrors";
import { uploadTempImageByFile, uploadTempImageByUrl } from "../UploadService";
import tempUploadsService from "../tempUploadsService";

jest.mock("cloudinary");
jest.mock("../tempUploadsService");

const mockCloudinary = cloudinary.uploader as jest.Mocked<
    typeof cloudinary.uploader
>;

const mockTempUploadsService = tempUploadsService as jest.Mocked<
    typeof tempUploadsService
>;

describe("UploadService", () => {
    const mockCloudinaryUpload = (mockCloudinary.upload = jest.fn());

    beforeEach(() => {
        mockCloudinaryUpload.mockResolvedValue(mockCloudinaryResponse);
    });

    describe("uploadTempImageByFile", () => {
        it("should upload an image file and return secure URL", async () => {
            const response = await uploadTempImageByFile(mockFolder, mockFile);

            expect(response).toBe(mockCloudinaryResponse.secure_url);
            expect(mockCloudinaryUpload).toHaveBeenCalled();
            expect(mockTempUploadsService.store).toHaveBeenCalledWith(
                mockCloudinaryResponse.secure_url,
                mockCloudinaryResponse.public_id
            );
        });

        it("should throw BadRequestError if no file is provided", async () => {
            const result = uploadTempImageByFile(mockFolder);
            await expect(result).rejects.toThrow(BadRequestError);
            expect(mockCloudinaryUpload).not.toHaveBeenCalled();
            expect(mockTempUploadsService.store).not.toHaveBeenCalled();
        });
    });

    describe("uploadTempImageByUrl", () => {
        it("should upload an image from URL and return the secure URL", async () => {
            const response = await uploadTempImageByUrl(
                mockFolder,
                mockImageUrl1
            );

            expect(response).toBe(mockCloudinaryResponse.secure_url);
            expect(mockCloudinaryUpload).toHaveBeenCalled();
            expect(mockTempUploadsService.store).toHaveBeenCalledWith(
                mockCloudinaryResponse.secure_url,
                mockCloudinaryResponse.public_id
            );
        });

        it("should throw if Cloudinary upload fails", async () => {
            mockCloudinaryUpload.mockRejectedValue(mockCloudinaryError);

            const result = uploadTempImageByUrl(mockFolder, mockImageUrl1);
            await expect(result).rejects.toThrow(mockCloudinaryError);

            expect(mockTempUploadsService.store).not.toHaveBeenCalled();
        });
    });
});
