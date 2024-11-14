"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Error {
    constructor(socket, message, code) {
        this.getError = (message, code, timestamp) => ({
            message: message,
            code: code,
            timestamp: timestamp
        });
        const timestamp = new Date().getTime();
        socket.emit("error", this.getError(message, code, timestamp));
    }
}
exports.default = Error;
