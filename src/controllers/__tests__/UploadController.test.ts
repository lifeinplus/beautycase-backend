import supertest from "supertest";

import app from "../../app";
import * as UploadService from "../../services/UploadService";
import { mockErrorUpload } from "../../tests/mocks/error";

jest.mock("../../services/UploadService");

const request = supertest(app);

const mockUploadService = UploadService as jest.Mocked<typeof UploadService>;

describe("UploadController", () => {
    const mockFolder = "products";
    const mockFilename = "test.jpg";
    const mockImageUrl1 = "https://cdn.com/image1.jpg";
    const mockImageUrl2 = "https://cdn.com/image2.jpg";

    describe("POST /api/uploads/temp-image-file", () => {
        it("should upload an image file and return imageUrl", async () => {
            mockUploadService.uploadTempImageByFile.mockResolvedValue(
                mockImageUrl1
            );

            const response = await request
                .post("/api/uploads/temp-image-file")
                .field("folder", mockFolder)
                .attach("imageFile", Buffer.from("test"), {
                    filename: mockFilename,
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.imageUrl).toBe(mockImageUrl1);

            expect(
                mockUploadService.uploadTempImageByFile
            ).toHaveBeenCalledTimes(1);

            expect(
                mockUploadService.uploadTempImageByFile
            ).toHaveBeenCalledWith(
                mockFolder,
                expect.objectContaining({ originalname: mockFilename })
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
                    filename: mockFilename,
                });

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("message");

            mockUploadService.uploadTempImageByFile.mockRestore();
        });
    });

    describe("POST /api/uploads/temp-image-url", () => {
        it("should upload an image from URL and return imageUrl", async () => {
            mockUploadService.uploadTempImageByUrl.mockResolvedValue(
                mockImageUrl1
            );

            const response = await request
                .post("/api/uploads/temp-image-url")
                .send({
                    folder: mockFolder,
                    imageUrl: mockImageUrl2,
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.imageUrl).toBe(mockImageUrl1);

            expect(
                mockUploadService.uploadTempImageByUrl
            ).toHaveBeenCalledTimes(1);

            expect(mockUploadService.uploadTempImageByUrl).toHaveBeenCalledWith(
                mockFolder,
                mockImageUrl2
            );
        });

        it("should handle service errors and call next middleware", async () => {
            mockUploadService.uploadTempImageByUrl.mockRejectedValue(
                mockErrorUpload
            );

            const response = await request
                .post("/api/uploads/temp-image-url")
                .send({
                    folder: mockFolder,
                    imageUrl: mockImageUrl2,
                });

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("message");

            mockUploadService.uploadTempImageByUrl.mockRestore();
        });
    });
});
