import Wordset from "../../classes/Wordset";
export default (words : string[]) => {
    const wordsCountInTeam = Math.ceil((words.length-1) / 3);
    let wordsCountInRedTeam = 0;
    let wordsCountInBlueTeam = 0;

    return words.map((word, index) => {
        if(index === 0)
            return new Wordset(word, "black");

        if(wordsCountInRedTeam < wordsCountInTeam){
            wordsCountInRedTeam++;
            return new Wordset(word, "red");
        }

        if(wordsCountInBlueTeam < wordsCountInTeam){
            wordsCountInBlueTeam++;
            return new Wordset(word, "blue");
        }

        return new Wordset(word, "neutral");

    })
}
