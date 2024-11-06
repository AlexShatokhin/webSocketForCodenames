"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRooms = exports.setRooms = exports.getRooms = void 0;
let rooms = [];
const getRooms = () => rooms;
exports.getRooms = getRooms;
const setRooms = (newRooms) => rooms = newRooms;
exports.setRooms = setRooms;
const changeRooms = (room) => {
    const index = rooms.findIndex(r => r.id === room.id);
    rooms[index] = room;
};
exports.changeRooms = changeRooms;
