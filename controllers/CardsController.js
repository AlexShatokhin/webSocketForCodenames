let rooms = require("../roomsData");

const getWordSet = require("../utils/words/getWordSet");
const getRoomIndexById = require("../utils/room/getRoomIndexById");

class CardsController {
    constructor(io){
        this.io = io;
    }

    getCards = (roomId) => {
        const wordset = getWordSet();
        const roomIndex = getRoomIndexById(roomId, rooms);
        rooms[roomIndex].cardset = wordset;

        this.io.in(roomId).emit("send-cards", wordset);
    }
}

module.exports = CardsController;