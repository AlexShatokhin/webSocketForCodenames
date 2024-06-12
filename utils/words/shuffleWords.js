const getRandomNumberFromRange = require("./getRandomNumberFromRange")

module.exports = (words) => {
    const shuffleResult = [...words];
    const maxRange = shuffleResult.length - 1;

    for(let  i = 0; i < shuffleResult.length; i++){
        const randomIndex = getRandomNumberFromRange(0, maxRange);
        [shuffleResult[i], shuffleResult[randomIndex]] = [shuffleResult[randomIndex], shuffleResult[i]];
    }
    return shuffleResult;
}