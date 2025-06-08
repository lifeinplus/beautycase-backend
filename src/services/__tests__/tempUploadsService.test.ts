import tempUploadsService from "../tempUploadsService";

describe("tempUploadsService", () => {
    beforeEach(() => {
        const service = tempUploadsService as any;
        service.uploads.clear();
    });

    describe("store", () => {
        it("should store a secure URL with its public ID", () => {
            const secureUrl = "https://secure.example.com/image123";
            const publicId = "public_id_123";

            tempUploadsService.store(secureUrl, publicId);

            expect(tempUploadsService.get(secureUrl)).toBe(publicId);
        });

        it("should overwrite existing entries with the same secure URL", () => {
            const secureUrl = "https://secure.example.com/image123";
            const publicId1 = "public_id_123";
            const publicId2 = "public_id_456";

            tempUploadsService.store(secureUrl, publicId1);
            tempUploadsService.store(secureUrl, publicId2);

            expect(tempUploadsService.get(secureUrl)).toBe(publicId2);
        });

        it("should handle multiple different secure URLs", () => {
            const secureUrl1 = "https://secure.example.com/image1";
            const secureUrl2 = "https://secure.example.com/image2";
            const publicId1 = "public_id_1";
            const publicId2 = "public_id_2";

            tempUploadsService.store(secureUrl1, publicId1);
            tempUploadsService.store(secureUrl2, publicId2);

            expect(tempUploadsService.get(secureUrl1)).toBe(publicId1);
            expect(tempUploadsService.get(secureUrl2)).toBe(publicId2);
        });

        it("should handle empty string values", () => {
            const secureUrl = "";
            const publicId = "";

            tempUploadsService.store(secureUrl, publicId);

            expect(tempUploadsService.get(secureUrl)).toBe(publicId);
        });
    });

    describe("get", () => {
        it("should return the public ID for an existing secure URL", () => {
            const secureUrl = "https://secure.example.com/image123";
            const publicId = "public_id_123";

            tempUploadsService.store(secureUrl, publicId);
            const result = tempUploadsService.get(secureUrl);

            expect(result).toBe(publicId);
        });

        it("should return undefined for a non-existing secure URL", () => {
            const result = tempUploadsService.get(
                "https://nonexistent.example.com/image"
            );

            expect(result).toBeUndefined();
        });

        it("should return undefined after removing an entry", () => {
            const secureUrl = "https://secure.example.com/image123";
            const publicId = "public_id_123";

            tempUploadsService.store(secureUrl, publicId);
            tempUploadsService.remove(secureUrl);
            const result = tempUploadsService.get(secureUrl);

            expect(result).toBeUndefined();
        });

        it("should handle empty string as a valid key", () => {
            const secureUrl = "";
            const publicId = "public_id_for_empty";

            tempUploadsService.store(secureUrl, publicId);
            const result = tempUploadsService.get(secureUrl);

            expect(result).toBe(publicId);
        });
    });

    describe("remove", () => {
        it("should remove an existing entry", () => {
            const secureUrl = "https://secure.example.com/image123";
            const publicId = "public_id_123";

            tempUploadsService.store(secureUrl, publicId);
            expect(tempUploadsService.get(secureUrl)).toBe(publicId);

            tempUploadsService.remove(secureUrl);
            expect(tempUploadsService.get(secureUrl)).toBeUndefined();
        });

        it("should handle removing a non-existing entry gracefully", () => {
            const nonExistentUrl = "https://nonexistent.example.com/image";

            expect(() => {
                tempUploadsService.remove(nonExistentUrl);
            }).not.toThrow();

            expect(tempUploadsService.get(nonExistentUrl)).toBeUndefined();
        });

        it("should only remove the specified entry", () => {
            const secureUrl1 = "https://secure.example.com/image1";
            const secureUrl2 = "https://secure.example.com/image2";
            const publicId1 = "public_id_1";
            const publicId2 = "public_id_2";

            tempUploadsService.store(secureUrl1, publicId1);
            tempUploadsService.store(secureUrl2, publicId2);

            tempUploadsService.remove(secureUrl1);

            expect(tempUploadsService.get(secureUrl1)).toBeUndefined();
            expect(tempUploadsService.get(secureUrl2)).toBe(publicId2);
        });

        it("should handle removing empty string key", () => {
            const secureUrl = "";
            const publicId = "public_id_for_empty";

            tempUploadsService.store(secureUrl, publicId);
            tempUploadsService.remove(secureUrl);

            expect(tempUploadsService.get(secureUrl)).toBeUndefined();
        });
    });

    describe("singleton behavior", () => {
        it("should maintain state across multiple imports", () => {
            const secureUrl = "https://secure.example.com/image123";
            const publicId = "public_id_123";

            tempUploadsService.store(secureUrl, publicId);

            const result = tempUploadsService.get(secureUrl);

            expect(result).toBe(publicId);
        });

        it("should persist data until explicitly removed", () => {
            const secureUrl1 = "https://secure.example.com/image1";
            const secureUrl2 = "https://secure.example.com/image2";
            const publicId1 = "public_id_1";
            const publicId2 = "public_id_2";

            tempUploadsService.store(secureUrl1, publicId1);
            tempUploadsService.store(secureUrl2, publicId2);

            expect(tempUploadsService.get(secureUrl1)).toBe(publicId1);
            expect(tempUploadsService.get(secureUrl2)).toBe(publicId2);

            tempUploadsService.remove(secureUrl1);

            expect(tempUploadsService.get(secureUrl1)).toBeUndefined();
            expect(tempUploadsService.get(secureUrl2)).toBe(publicId2);
        });
    });

    describe("edge cases", () => {
        it("should handle special characters in URLs and IDs", () => {
            const secureUrl =
                "https://secure.example.com/image-with-special_chars?param=value&other=123";
            const publicId = "public_id_with-special_chars.123";

            tempUploadsService.store(secureUrl, publicId);

            expect(tempUploadsService.get(secureUrl)).toBe(publicId);
        });

        it("should handle very long strings", () => {
            const longSecureUrl =
                "https://secure.example.com/" + "a".repeat(1000);
            const longPublicId = "public_id_" + "b".repeat(1000);

            tempUploadsService.store(longSecureUrl, longPublicId);

            expect(tempUploadsService.get(longSecureUrl)).toBe(longPublicId);
        });

        it("should handle null-like string values", () => {
            const secureUrl = "null";
            const publicId = "undefined";

            tempUploadsService.store(secureUrl, publicId);

            expect(tempUploadsService.get(secureUrl)).toBe(publicId);
        });
    });
});
