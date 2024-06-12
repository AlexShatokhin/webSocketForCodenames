const { v4: uuidv4 } = require('uuid');

class Room {
    constructor(wordset=[], limit = 3){
        this.id = uuidv4();
        this.wordset = wordset;
        this.limit = limit
    }

    getRoomId(){
        return this.id;
    }
}

module.exports = Room;