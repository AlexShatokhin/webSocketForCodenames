import Wordset from "./Wordset";

const { v4: uuidv4 } = require('uuid');

class Room {
    private id : number;
    public cardset : Wordset[];
    private name : string;
    private limit: number;

    constructor(name: string = "new", wordset : Wordset[]=[], limit : number = 3){
        this.id = uuidv4();
        this.name = name;
        this.cardset = wordset;
        this.limit = limit
    }

    getRoomId(){
        return this.id;
    }
}

export default Room