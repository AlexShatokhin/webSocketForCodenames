const { v4: uuidv4 } = require('uuid');

class Room {
    private id : number;
    private wordset : object[];
    private name : string;
    private limit: number;

    constructor(name: string, wordset=[], limit = 3){
        this.id = uuidv4();
        this.name = name;
        this.wordset = wordset;
        this.limit = limit
    }

    getRoomId(){
        return this.id;
    }
}

export default Room