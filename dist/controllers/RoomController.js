"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roomsData_1 = __importDefault(require("../data/roomsData"));
const Room_1 = __importDefault(require("../classes/Room"));
const Error_1 = __importDefault(require("../classes/Error"));
const getRoomByRoomId_1 = __importDefault(require("../utils/room/getRoomByRoomId"));
const getUserByUserId_1 = __importDefault(require("../utils/user/getUserByUserId"));
class RoomController {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.getRooms = () => roomsData_1.default;
        this.createRoom = (name, password) => {
            const newRoom = new Room_1.default(name, password);
            roomsData_1.default.push(newRoom);
            this.io.emit("get-rooms", roomsData_1.default);
        };
        this.joinRoom = (roomId, userId, password) => {
            this.room = (0, getRoomByRoomId_1.default)(roomId);
            this.user = (0, getUserByUserId_1.default)(userId);
            if (+this.room.password !== +password) {
                this.socket.emit("error", new Error_1.default("Password is incorrect", 401).getError());
                return;
            }
            this.user.room = this.room.id;
            this.room.joinRoom(this.user);
            this.socket.join(this.room.id);
            this.socket.emit("update-room", this.room.getRoomInfo());
            this.io.emit("get-rooms", roomsData_1.default);
        };
        this.leaveRoom = () => {
            if (this.user && this.room) {
                this.user.leaveRoom();
                this.room.leaveRoom(this.user);
                this.socket.leave(this.room.id);
                this.socket.emit("leave-from-room");
                this.io.emit("get-rooms", roomsData_1.default);
            }
            else
                this.socket.emit("error", new Error_1.default("User or room not found", 404).getError());
        };
    }
}
exports.default = RoomController;
