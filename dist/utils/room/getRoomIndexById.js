"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (roomId, rooms) => {
    return rooms.map(room => room.getRoomId()).indexOf(roomId);
};
