"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (words) => {
    const wordsCountInTeam = Math.ceil((words.length - 1) / 3);
    let wordsCountInRedTeam = 0;
    let wordsCountInBlueTeam = 0;
    return words.map((word, index) => {
        if (index === 0)
            return getWord(word, "black");
        if (wordsCountInRedTeam < wordsCountInTeam) {
            wordsCountInRedTeam++;
            return getWord(word, "red");
        }
        if (wordsCountInBlueTeam < wordsCountInTeam) {
            wordsCountInBlueTeam++;
            return getWord(word, "blue");
        }
        return getWord(word, "neutral");
    });
};
function getWord(wordText, team) {
    return { word: wordText, teamName: team, isClicked: false };
}
