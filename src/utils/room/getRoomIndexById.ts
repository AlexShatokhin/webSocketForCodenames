import Room from "../../classes/Room";

export default (roomId : number, rooms : Room[]) => {
    return rooms.map(room => room.getRoomId()).indexOf(roomId);
}