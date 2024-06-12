const getUniqueWords = require("./getUniqueWords");
const convertWords = require('./convertWords');
const shuffleWords = require('./shuffleWords');

module.exports = (wordsCount = 9) => {
    const uniqueWords = getUniqueWords(wordsCount);
    const convertedWords = convertWords(uniqueWords)
    return shuffleWords(convertedWords);
}