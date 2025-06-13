import supertest from "supertest";

import app from "../../app";
import * as UploadService from "../../services/UploadService";
import { mockErrorUpload } from "../../tests/mocks/error";

jest.mock("../../services/UploadService");

const request = supertest(app);

const mockUploadService = UploadService as jest.Mocked<typeof UploadService>;

describe("UploadController", () => {
    const mockFolder = "products";
    const mockFileName = "test.jpg";
    const mockImageUrl = "https://cdn.com/image.jpg";

    describe("POST /api/uploads/temp-image-file", () => {
        it("should upload an image and return imageUrl", async () => {
            mockUploadService.uploadTempImageByFile.mockResolvedValue(
                mockImageUrl
            );

            const response = await request
                .post("/api/uploads/temp-image-file")
                .field("folder", mockFolder)
                .attach("imageFile", Buffer.from("test"), {
                    filename: mockFileName,
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.imageUrl).toBe(mockImageUrl);

            expect(
                mockUploadService.uploadTempImageByFile
            ).toHaveBeenCalledTimes(1);
            expect(
                mockUploadService.uploadTempImageByFile
            ).toHaveBeenCalledWith(
                mockFolder,
                expect.objectContaining({ originalname: mockFileName })
            );
        });

        it("should handle service errors and call next middleware", async () => {
            mockUploadService.uploadTempImageByFile.mockRejectedValue(
                mockErrorUpload
            );

            const response = await request
                .post("/api/uploads/temp-image-file")
                .field("folder", mockFolder)
                .attach("imageFile", Buffer.from("test"), {
                    filename: mockFileName,
                });

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("message");

            mockUploadService.uploadTempImageByFile.mockRestore();
        });
    });
});
