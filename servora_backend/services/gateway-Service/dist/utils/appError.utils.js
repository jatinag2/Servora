"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appError = void 0;
class appError extends Error {
    constructor(message, statusCode) {
        super(message),
            this.statusCode = statusCode;
    }
}
exports.appError = appError;
