import { getRooms } from "../../data/roomsData"
import Room from "../../classes/Room"

const getConvertedRooms = () => 
    getRooms().map((room : Room) => ({
        id: room.id,
        name: room.name,
        language: room.roomLanguage,
        usersInRoom: room.usersInRoom,
        creator: room.creator,
        isGameStarted: room.isGameStarted,
        isGameFinished: room.isGameFinished,
        cardset: null,
        users: null
    }))

export default getConvertedRooms