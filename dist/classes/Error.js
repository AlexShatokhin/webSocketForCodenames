"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Error {
    constructor(socket, message) {
        this.getError = (message, timestamp) => ({
            message: message,
            timestamp: timestamp
        });
        const timestamp = new Date().getTime();
        socket.emit("error", this.getError(message, timestamp));
    }
}
exports.default = Error;
