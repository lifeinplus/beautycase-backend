export class AppError extends Error {
    public readonly status: number;
    public readonly details?: string[];

    constructor(message: string, status: number, details?: string[]) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

export class BadRequestError extends AppError {
    constructor(message: string, details?: string[]) {
        super(message, 400, details);
        this.name = "BadRequestError";
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, 401);
        this.name = "UnauthorizedError";
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
        this.name = "NotFoundError";
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
        this.name = "ConflictError";
    }
}
