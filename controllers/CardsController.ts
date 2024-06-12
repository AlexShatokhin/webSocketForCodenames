import { Server } from "socket.io";
let rooms = require("../roomsData");

const getWordSet = require("../utils/words/getWordSet");
const getRoomIndexById = require("../utils/room/getRoomIndexById");

class CardsController {
    constructor(private io : Server){}

    getCards = (roomId : number) => {
        const wordset = getWordSet();
        const roomIndex = getRoomIndexById(roomId, rooms);
        rooms[roomIndex].cardset = wordset;

        this.io.in(roomId.toString()).emit("send-cards", wordset);
    }
}

export default CardsController