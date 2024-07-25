"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRooms = exports.getRooms = void 0;
let rooms = [];
const getRooms = () => rooms;
exports.getRooms = getRooms;
const setRooms = (newRooms) => rooms = newRooms;
exports.setRooms = setRooms;
