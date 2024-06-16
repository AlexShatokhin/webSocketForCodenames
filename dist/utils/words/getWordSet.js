"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getUniqueWords_1 = __importDefault(require("./getUniqueWords"));
const convertWords_1 = __importDefault(require("./convertWords"));
const shuffleWords_1 = __importDefault(require("./shuffleWords"));
exports.default = (wordsCount = 9, wordsetType) => {
    const uniqueWords = (0, getUniqueWords_1.default)(wordsCount, wordsetType);
    const convertedWords = (0, convertWords_1.default)(uniqueWords);
    return (0, shuffleWords_1.default)(convertedWords);
};
