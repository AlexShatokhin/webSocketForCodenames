import getUniqueWords from "./getUniqueWords";
import convertWords from "./convertWords";
import shuffleWords from "./shuffleWords";

export default (wordsCount = 9) => {
    const uniqueWords = getUniqueWords(wordsCount);
    const convertedWords = convertWords(uniqueWords)
    return shuffleWords(convertedWords);
}