export const mockCloudinaryResponse = {
    public_id: "products/temp/abc123",
    secure_url: "https://cdn.com/uploadedimage.jpg",
};

export const mockFilename = "test.jpg";
export const mockFolder = "products";

export const mockFile: Express.Multer.File = {
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

export const mockImageUrl1 = "https://cdn.com/image1.jpg";
export const mockImageUrl2 = "https://cdn.com/image2.jpg";
