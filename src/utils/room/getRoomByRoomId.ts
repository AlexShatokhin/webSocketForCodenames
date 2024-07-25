import { getRooms } from "../../data/roomsData";

export default (roomId : string) => {
    const rooms = getRooms();
    const roomIndex = rooms.map(room => room.id).indexOf(roomId);
    return rooms[roomIndex];
}