module.exports = (words) => {
    const wordsCountInTeam = Math.ceil((words.length-1) / 3);
    let wordsCountInRedTeam = 0;
    let wordsCountInBlueTeam = 0;

    return words.map((word, index) => {
        if(index === 0)
            return createWordObject(word, "black");

        if(wordsCountInRedTeam < wordsCountInTeam){
            wordsCountInRedTeam++;
            return createWordObject(word, "red");
        }

        if(wordsCountInBlueTeam < wordsCountInTeam){
            wordsCountInBlueTeam++;
            return createWordObject(word, "blue");
        }

        return createWordObject(word, "neutral");

    })
}

function createWordObject(word, teamName){
    return {word, team: teamName, isClicked: false}
}