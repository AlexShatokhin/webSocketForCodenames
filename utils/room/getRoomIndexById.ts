import Room from "../../controllers/Room";

module.exports = (roomId : number, rooms : Room[]) => {
    return rooms.map(room => room.getRoomId()).indexOf(roomId);
}