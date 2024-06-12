import getRandomNumberFromRange from "./getRandomNumberFromRange";
import words from "../../words.js"


export default (count : number) => {
    const uniqueWords = new Set<string>();
    const maxRange = words.length - 1;
    
    while(uniqueWords.size < count) {
        uniqueWords.add(words[getRandomNumberFromRange(0, maxRange)]);
    }
    
    return Array.from(uniqueWords);
}