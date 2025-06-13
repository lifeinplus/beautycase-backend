export interface ImageDocument {
    _id: unknown;
    imageId?: string;
    imageUrl: string;
}

export interface ImageOptions {
    destroyOnReplace?: boolean;
    filename?: string;
    folder: string;
    secureUrl: string;
}

export interface ImageUploadResponse {
    public_id: string;
    secure_url: string;
}
