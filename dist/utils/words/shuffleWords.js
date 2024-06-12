"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getRandomNumberFromRange_1 = __importDefault(require("./getRandomNumberFromRange"));
exports.default = (words) => {
    const shuffleResult = [...words];
    const maxRange = shuffleResult.length - 1;
    for (let i = 0; i < shuffleResult.length; i++) {
        const randomIndex = (0, getRandomNumberFromRange_1.default)(0, maxRange);
        [shuffleResult[i], shuffleResult[randomIndex]] = [shuffleResult[randomIndex], shuffleResult[i]];
    }
    return shuffleResult;
};
