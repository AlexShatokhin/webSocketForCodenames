import Room from "../classes/Room";

let rooms :Room[] = [];
export const getRooms = () => rooms;
export const setRooms = (newRooms : Room[]) => rooms = newRooms;
export const changeRooms = (room : Room) => {
    const index = rooms.findIndex(r => r.id === room.id);
    rooms[index] = room;
}
