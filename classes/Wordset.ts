type teamNameType = "black" | "red" | "blue" | "neutral";


class Wordset{
    constructor(private word : string, 
                private teamName : teamNameType, 
                private isClicked : boolean = false ){}
}

export default Wordset;