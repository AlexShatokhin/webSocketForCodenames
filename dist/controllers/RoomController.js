"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roomsData_1 = __importDefault(require("../roomsData"));
const getRoomIndexById_1 = __importDefault(require("../utils/room/getRoomIndexById"));
const Room_1 = __importDefault(require("../classes/Room"));
class RoomController {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.getRooms = () => roomsData_1.default;
        this.createRoom = (name, limit) => {
            const newRoom = new Room_1.default(name, limit);
            roomsData_1.default.push(newRoom);
            this.io.emit("get-rooms", roomsData_1.default);
        };
        this.joinRoom = (roomId) => {
            const room = roomsData_1.default[(0, getRoomIndexById_1.default)(roomId, roomsData_1.default)];
            room.joinRoom(this.socket);
            this.io.emit("get-rooms", roomsData_1.default);
        };
        this.leaveRoom = (roomId) => {
            const room = roomsData_1.default[(0, getRoomIndexById_1.default)(roomId, roomsData_1.default)];
            room.leaveRoom(this.socket);
            this.io.emit("get-rooms", roomsData_1.default);
        };
    }
}
exports.default = RoomController;
