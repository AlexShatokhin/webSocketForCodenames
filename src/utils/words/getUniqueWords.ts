import { wordSetType } from './../../types/wordSetType';
import getRandomNumberFromRange from "./getRandomNumberFromRange";
import words from "../../data/words"


export default (count : number, wordset: wordSetType) => {
    const uniqueWords = new Set<string>();
    const neededWords = words[wordset];
    const maxRange = neededWords.length - 1;
    
    while(uniqueWords.size < count) {
        uniqueWords.add(neededWords[getRandomNumberFromRange(0, maxRange)]);
    }
    
    return Array.from(uniqueWords);
}