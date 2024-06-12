const getRandomNumberFromRange = require('./getRandomNumberFromRange');
const words = require('../../words');

export default (count : number) => {
    const uniqueWords = new Set();
    const maxRange = words.length - 1;
    
    while(uniqueWords.size < count) {
        uniqueWords.add(words[getRandomNumberFromRange(0, maxRange)]);
    }
    
    return Array.from(uniqueWords);
}