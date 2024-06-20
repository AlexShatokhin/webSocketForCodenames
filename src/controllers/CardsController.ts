import { Server } from "socket.io";

import getWordSet from "../utils/words/getWordSet";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import { wordSetType } from "../types/wordSetType";

class CardsController {
    constructor(private io : Server){}

    getCards = (roomId : string, wordsetType : wordSetType) => {
        console.log(wordsetType);
        const wordset = getWordSet(9, wordsetType);
        const room = getRoomByRoomId(roomId);
        room.cardset = wordset;

        this.io.in(roomId).emit("get-cards", wordset);
    }
}

export default CardsController