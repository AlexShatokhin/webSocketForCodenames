"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getRandomNumberFromRange_1 = __importDefault(require("./getRandomNumberFromRange"));
const words_1 = __importDefault(require("../../words"));
exports.default = (count) => {
    const uniqueWords = new Set();
    const maxRange = words_1.default.length - 1;
    while (uniqueWords.size < count) {
        uniqueWords.add(words_1.default[(0, getRandomNumberFromRange_1.default)(0, maxRange)]);
    }
    return Array.from(uniqueWords);
};
