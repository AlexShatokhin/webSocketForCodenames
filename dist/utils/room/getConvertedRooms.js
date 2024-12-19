"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roomsData_1 = require("../../data/roomsData");
const getConvertedRooms = () => (0, roomsData_1.getRooms)().map((room) => ({
    id: room.id,
    name: room.name,
    usersInRoom: room.usersInRoom,
    creator: room.creator,
    isGameStarted: room.isGameStarted,
    cardset: null,
    users: null
}));
exports.default = getConvertedRooms;