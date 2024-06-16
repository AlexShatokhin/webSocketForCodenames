"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getRandomNumberFromRange_1 = __importDefault(require("./getRandomNumberFromRange"));
const words_1 = __importDefault(require("../../data/words"));
exports.default = (count, wordset) => {
    const uniqueWords = new Set();
    const neededWords = words_1.default[wordset];
    const maxRange = neededWords.length - 1;
    while (uniqueWords.size < count) {
        uniqueWords.add(neededWords[(0, getRandomNumberFromRange_1.default)(0, maxRange)]);
    }
    return Array.from(uniqueWords);
};
