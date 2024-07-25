import Room from "../classes/Room";

let rooms :Room[] = [];
export const getRooms = () => rooms;
export const setRooms = (newRooms : Room[]) => rooms = newRooms;
