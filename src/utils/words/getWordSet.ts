import getUniqueWords from "./getUniqueWords";
import convertWords from "./convertWords";
import shuffleWords from "./shuffleWords";
import { wordSetType } from "../../types/wordSetType";

export default (wordsCount = 9, wordsetType: wordSetType) => {
    const uniqueWords = getUniqueWords(wordsCount, wordsetType);
    const convertedWords = convertWords(uniqueWords)
    return shuffleWords(convertedWords);
}