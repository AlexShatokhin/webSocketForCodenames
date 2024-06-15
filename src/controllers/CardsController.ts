import { Server } from "socket.io";

import getWordSet from "../utils/words/getWordSet";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";

class CardsController {
    constructor(private io : Server){}

    getCards = (roomId : string) => {
        const wordset = getWordSet();
        const room = getRoomByRoomId(roomId);
       room.cardset = wordset;

        this.io.in(roomId.toString()).emit("send-cards", wordset);
    }
}

export default CardsController