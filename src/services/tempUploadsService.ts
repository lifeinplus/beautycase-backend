class TempUploadsService {
    private uploads: Map<string, string>;

    constructor() {
        this.uploads = new Map<string, string>();
    }

    store(secureUrl: string, publicId: string) {
        this.uploads.set(secureUrl, publicId);
    }

    get(secureUrl: string) {
        return this.uploads.get(secureUrl);
    }

    remove(secureUrl: string) {
        this.uploads.delete(secureUrl);
    }
}

export const tempUploadsService = new TempUploadsService();
