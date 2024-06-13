"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roomsData_1 = __importDefault(require("../data/roomsData"));
const Room_1 = __importDefault(require("../classes/Room"));
const getRoomByRoomId_1 = __importDefault(require("../utils/room/getRoomByRoomId"));
const getUserByUserId_1 = __importDefault(require("../utils/user/getUserByUserId"));
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
        this.joinRoom = (roomId, userId) => {
            const room = (0, getRoomByRoomId_1.default)(roomId);
            const user = (0, getUserByUserId_1.default)(userId);
            user.joinRoom(room.id);
            room.joinRoom(this.socket, user);
            this.socket.emit("joined-room", room.getRoomInfo());
            this.io.emit("get-rooms", roomsData_1.default);
        };
        this.leaveRoom = (roomId, userId) => {
            const room = (0, getRoomByRoomId_1.default)(roomId);
            const user = (0, getUserByUserId_1.default)(userId);
            user.leaveRoom();
            room.leaveRoom(this.socket, user);
            this.io.emit("get-rooms", roomsData_1.default);
        };
    }
}
exports.default = RoomController;
