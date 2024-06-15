import rooms from "../../data/roomsData";

export default (roomId : string) => {
    const roomIndex = rooms.map(room => room.getRoomId().toString()).indexOf(roomId);
    return rooms[roomIndex];
}