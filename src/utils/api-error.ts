export class ApiError extends Error {
    public readonly status: number;
    public readonly success = false;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    toJSON() {
        return {
            success: false,
            status: this.status || 500,
            message: this.message || "Internal server error",
        };
    }
}
