import Wordset from "../../classes/Wordset";
import { Word } from "../../types/Word";
import getRandomNumberFromRange from "./getRandomNumberFromRange";

export default (words : Word[]) => {
    const shuffleResult = [...words];
    const maxRange = shuffleResult.length - 1;

    for(let  i = 0; i < shuffleResult.length; i++){
        const randomIndex = getRandomNumberFromRange(0, maxRange);
        [shuffleResult[i], shuffleResult[randomIndex]] = [shuffleResult[randomIndex], shuffleResult[i]];
    }
    return shuffleResult;
}