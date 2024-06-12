"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wordset_1 = __importDefault(require("../../classes/Wordset"));
exports.default = (words) => {
    const wordsCountInTeam = Math.ceil((words.length - 1) / 3);
    let wordsCountInRedTeam = 0;
    let wordsCountInBlueTeam = 0;
    return words.map((word, index) => {
        if (index === 0)
            return new Wordset_1.default(word, "black");
        if (wordsCountInRedTeam < wordsCountInTeam) {
            wordsCountInRedTeam++;
            return new Wordset_1.default(word, "red");
        }
        if (wordsCountInBlueTeam < wordsCountInTeam) {
            wordsCountInBlueTeam++;
            return new Wordset_1.default(word, "blue");
        }
        return new Wordset_1.default(word, "neutral");
    });
};
