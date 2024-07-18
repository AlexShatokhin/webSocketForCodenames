"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorBoundary = (callback, args) => {
    try {
        callback(...args);
    }
    catch (error) {
        if (error instanceof Error)
            console.error(`
            !!ERROR!!
            Type: ${error.name}
            Message: ${error.message}
        `);
    }
};
exports.default = errorBoundary;
