"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roomsData_1 = require("../../data/roomsData");
exports.default = (roomId) => {
    const rooms = (0, roomsData_1.getRooms)();
    const roomIndex = rooms.map(room => room.id).indexOf(roomId);
    return rooms[roomIndex];
};
