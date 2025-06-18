import { v2 as cloudinary } from "cloudinary";

import Logging from "../../library/Logging";
import { mockCloudinaryError } from "../../tests/mocks/error";
import {
    handleImageUpload,
    handleImageUpdate,
    handleImageDeletion,
} from "../ImageService";
import tempUploadsService from "../tempUploadsService";

jest.mock("cloudinary");
jest.mock("../../library/Logging");
jest.mock("../tempUploadsService");

const mockCloudinary = cloudinary.uploader as jest.Mocked<
    typeof cloudinary.uploader
>;

const mockLogging = Logging as jest.Mocked<typeof Logging>;

const mockTempUploadsService = tempUploadsService as jest.Mocked<
    typeof tempUploadsService
>;

describe("ImageService", () => {
    const mockDoc = {
        _id: "product1",
        imageId: undefined,
        imageUrl: "",
    };

    const mockFolder = "products";
    const mockPublicId = "test_public_id";

    const mockCloudinaryResponse = {
        public_id: "products/renamed-id",
        secure_url: "https://cloudinary.com/renamed-image.jpg",
    };

    beforeEach(() => {
        mockCloudinary.explicit = jest
            .fn()
            .mockResolvedValue(mockCloudinaryResponse);

        mockCloudinary.rename = jest
            .fn()
            .mockResolvedValue(mockCloudinaryResponse);

        mockCloudinary.destroy.mockResolvedValue({});
    });

    describe("handleImageUpload", () => {
        it("should handle image upload and set imageId and imageUrl", async () => {
            mockTempUploadsService.get.mockReturnValue(mockPublicId);

            const mockSecureUrl = "https://cloudinary.com/image.jpg";
            const doc = { ...mockDoc, imageUrl: mockSecureUrl };

            await handleImageUpload(doc, {
                folder: mockFolder,
                secureUrl: mockSecureUrl,
            });

            expect(mockCloudinary.explicit).toHaveBeenCalled();
            expect(mockCloudinary.rename).toHaveBeenCalled();

            expect(doc.imageId).toBe(mockCloudinaryResponse.public_id);
            expect(doc.imageUrl).toBe(mockCloudinaryResponse.secure_url);

            expect(mockTempUploadsService.remove).toHaveBeenCalledWith(
                mockSecureUrl
            );
        });

        it("should skip if no publicId", async () => {
            mockTempUploadsService.get.mockReturnValue(undefined);

            const mockSecureUrl = "https://cdn.com/image.jpg";
            const doc = { ...mockDoc, imageUrl: mockSecureUrl };

            await handleImageUpload(doc, {
                folder: mockFolder,
                secureUrl: mockSecureUrl,
            });

            expect(mockCloudinary.explicit).not.toHaveBeenCalled();
            expect(mockCloudinary.rename).not.toHaveBeenCalled();
            expect(mockTempUploadsService.remove).not.toHaveBeenCalledWith();
        });

        it("should handle error during image upload and rethrow", async () => {
            mockTempUploadsService.get.mockReturnValue(mockPublicId);
            mockCloudinary.explicit.mockRejectedValue(mockCloudinaryError);

            const mockSecureUrl = "https://cloudinary.com/image.jpg";
            const doc = { ...mockDoc, imageUrl: mockSecureUrl };

            const result = handleImageUpload(doc, {
                folder: mockFolder,
                secureUrl: mockSecureUrl,
            });

            await expect(result).rejects.toThrow(mockCloudinaryError);

            expect(mockLogging.error).toHaveBeenCalledWith(mockCloudinaryError);

            expect(mockCloudinary.rename).not.toHaveBeenCalled();
            expect(mockTempUploadsService.remove).not.toHaveBeenCalledWith();
        });
    });

    describe("handleImageUpdate", () => {
        it("should update image if temp image exists", async () => {
            mockTempUploadsService.get.mockReturnValue(mockPublicId);

            const mockSecureUrl = "https://cloudinary.com/image.jpg";
            const doc = { ...mockDoc, imageUrl: mockSecureUrl };

            await handleImageUpdate(doc, {
                folder: mockFolder,
                secureUrl: mockSecureUrl,
            });

            expect(doc.imageId).toBe(mockCloudinaryResponse.public_id);
            expect(doc.imageUrl).toBe(mockCloudinaryResponse.secure_url);

            expect(mockTempUploadsService.remove).toHaveBeenCalledWith(
                mockSecureUrl
            );

            expect(mockCloudinary.destroy).not.toHaveBeenCalled();
        });

        it("should destroy old image if new image is not from cloudinary", async () => {
            mockTempUploadsService.get.mockReturnValue(undefined);

            const mockPublicId = "old_public_id";
            const mockSecureUrl = "https://cdn.com/image.jpg";

            const doc = {
                ...mockDoc,
                imageId: mockPublicId,
                imageUrl: mockSecureUrl,
            };

            await handleImageUpdate(doc, {
                folder: mockFolder,
                secureUrl: mockSecureUrl,
            });

            expect(mockCloudinary.explicit).not.toHaveBeenCalled();
            expect(mockCloudinary.rename).not.toHaveBeenCalled();

            expect(mockCloudinary.destroy).toHaveBeenCalledWith(mockPublicId);

            expect(doc.imageId).toBeUndefined();
        });

        it("should not destroy if destroyOnReplace is false", async () => {
            mockTempUploadsService.get.mockReturnValue(undefined);

            const mockPublicId = "old_public_id";
            const mockSecureUrl = "https://cdn.com/image.jpg";

            const doc = {
                ...mockDoc,
                imageId: mockPublicId,
                imageUrl: mockSecureUrl,
            };

            await handleImageUpdate(doc, {
                destroyOnReplace: false,
                folder: mockFolder,
                secureUrl: doc.imageUrl,
            });

            expect(mockCloudinary.explicit).not.toHaveBeenCalled();
            expect(mockCloudinary.rename).not.toHaveBeenCalled();
            expect(mockCloudinary.destroy).not.toHaveBeenCalled();

            expect(doc.imageId).toBeUndefined();
        });

        it("should handle error during image update and rethrow", async () => {
            mockTempUploadsService.get.mockReturnValue(mockPublicId);
            mockCloudinary.rename.mockRejectedValue(mockCloudinaryError);

            const mockSecureUrl = "https://cloudinary.com/image.jpg";
            const doc = { ...mockDoc, imageUrl: mockSecureUrl };

            const result = handleImageUpdate(doc, {
                folder: mockFolder,
                secureUrl: mockSecureUrl,
            });

            await expect(result).rejects.toThrow(mockCloudinaryError);

            expect(mockLogging.error).toHaveBeenCalledWith(mockCloudinaryError);

            expect(mockCloudinary.explicit).not.toHaveBeenCalled();
            expect(mockTempUploadsService.remove).not.toHaveBeenCalledWith();
            expect(mockCloudinary.destroy).not.toHaveBeenCalled();
        });

        it("should handle error during image destroy but not rethrow", async () => {
            mockTempUploadsService.get.mockReturnValue(undefined);
            mockCloudinary.destroy.mockRejectedValue(mockCloudinaryError);

            const mockPublicId = "old_public_id";
            const mockSecureUrl = "https://cdn.com/image.jpg";

            const doc = {
                ...mockDoc,
                imageId: mockPublicId,
                imageUrl: mockSecureUrl,
            };

            await handleImageUpdate(doc, {
                folder: mockFolder,
                secureUrl: mockSecureUrl,
            });

            expect(mockCloudinary.explicit).not.toHaveBeenCalled();
            expect(mockCloudinary.rename).not.toHaveBeenCalled();
            expect(mockTempUploadsService.remove).not.toHaveBeenCalledWith();

            expect(mockCloudinary.destroy).toHaveBeenCalledWith(mockPublicId);
            expect(mockLogging.error).toHaveBeenCalledWith(mockCloudinaryError);
        });
    });

    describe("handleImageDeletion", () => {
        it("should delete image when publicId is provided", async () => {
            const mockPublicId = "old_public_id";
            await handleImageDeletion(mockPublicId);
            expect(mockCloudinary.destroy).toHaveBeenCalledWith(mockPublicId);
        });

        it("should skip if publicId is undefined", async () => {
            await handleImageDeletion(undefined);
            expect(mockCloudinary.destroy).not.toHaveBeenCalled();
        });

        it("should log error when deletion fails", async () => {
            mockCloudinary.destroy.mockRejectedValue(mockCloudinaryError);

            const mockPublicId = "old_public_id";
            await handleImageDeletion(mockPublicId);

            expect(mockCloudinary.destroy).toHaveBeenCalledWith(mockPublicId);
            expect(mockLogging.error).toHaveBeenCalledWith(mockCloudinaryError);
        });
    });
});
