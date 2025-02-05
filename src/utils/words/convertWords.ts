import { Word } from "../../types/Word";
export default (words : string[]) => {
    const wordsCountInTeam = Math.ceil((words.length-1) / 3);
    let wordsCountInRedTeam = 0;
    let wordsCountInBlueTeam = 0;

    return words.map((word, index) => {
        if(index === 0)
            return getWord(word, "black");

        if(wordsCountInRedTeam < wordsCountInTeam){
            wordsCountInRedTeam++;
            return getWord(word, "red");
        }

        if(wordsCountInBlueTeam < wordsCountInTeam+1){
            wordsCountInBlueTeam++;
            return getWord(word, "blue");
        }

        return getWord(word, "neutral");

    })
}

function getWord(wordText : string, team : "black" | "red" | "blue" | "neutral") : Word{
    return {word: wordText, teamName: team, isClicked: false}
}
