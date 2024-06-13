"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roomsData_1 = __importDefault(require("../../data/roomsData"));
exports.default = (roomId) => {
    const roomIndex = roomsData_1.default.map(room => room.getRoomId()).indexOf(roomId);
    return roomsData_1.default[roomIndex];
};
