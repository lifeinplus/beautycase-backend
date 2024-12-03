export class AppError extends Error {
    public readonly status: number;
    public readonly details?: string[];

    constructor(status: number, message?: string, details?: string[]) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

export class BadRequestError extends AppError {
    constructor(message: string, details?: string[]) {
        super(400, message, details);
        this.name = "BadRequestError";
    }
}

export class UnauthorizedError extends AppError {
    constructor(message?: string) {
        super(401, message);
        this.name = "UnauthorizedError";
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(404, message);
        this.name = "NotFoundError";
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(409, message);
        this.name = "ConflictError";
    }
}
