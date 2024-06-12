"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createRoom_1 = __importDefault(require("../utils/room/createRoom"));
const roomsData_1 = __importDefault(require("../roomsData"));
class RoomController {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.getRooms = () => roomsData_1.default;
        this.createRoom = () => {
            roomsData_1.default.push((0, createRoom_1.default)());
            this.io.emit("connected", roomsData_1.default);
        };
        this.joinRoom = (roomId) => {
            this.socket.join(roomId.toString());
            console.log(`User ${this.socket.id} joined room ${roomId}`);
            this.socket.emit("joined-room", roomId);
        };
        this.leaveRoom = () => {
        };
    }
}
exports.default = RoomController;
