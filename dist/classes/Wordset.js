"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Wordset {
    constructor(word, teamName, isClicked = false) {
        this.word = word;
        this.teamName = teamName;
        this.isClicked = isClicked;
    }
}
exports.default = Wordset;
