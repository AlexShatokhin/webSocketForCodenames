import rooms from "../../data/roomsData";

export default (roomId : string) => {
    const roomIndex = rooms.map(room => room.id).indexOf(roomId);
    return rooms[roomIndex];
}