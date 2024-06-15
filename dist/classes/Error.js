"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Error {
    constructor(message, code) {
        this.message = message;
        this.code = code;
        this.timestamp = Date.now();
        this.getError = () => ({
            message: this.message,
            code: this.code,
            timestamp: this.timestamp
        });
    }
}
exports.default = Error;
