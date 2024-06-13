import rooms from "../../data/roomsData";

export default (roomId : number) => {
    const roomIndex = rooms.map(room => room.getRoomId()).indexOf(roomId);
    return rooms[roomIndex];
}