"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Error {
    constructor(socket, message, code) {
        this.socket = socket;
        this.message = message;
        this.code = code;
        this.timestamp = Date.now();
        this.getError = () => ({
            message: this.message,
            code: this.code,
            timestamp: this.timestamp
        });
        this.socket.emit("error", this.getError());
    }
}
exports.default = Error;
