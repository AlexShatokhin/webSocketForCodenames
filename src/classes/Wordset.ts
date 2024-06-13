type wordType = "black" | "red" | "blue" | "neutral";


class Wordset{
    constructor(private word : string, 
                private teamName : wordType, 
                private isClicked : boolean = false ){}
}

export default Wordset;