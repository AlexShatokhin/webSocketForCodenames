import { Server } from "socket.io";
import rooms from "../data/roomsData";

import getWordSet from "../utils/words/getWordSet";
import getRoomIndexById from "../utils/room/getRoomIndexById";
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