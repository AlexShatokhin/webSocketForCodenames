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
        this.getRooms = () => {
            return roomsData_1.default.map((room) => ({
                id: room.id,
                name: room.name,
                usersInRoom: room.usersInRoom,
                cardset: null,
                users: null
            }));
        };
        this.createRoom = (name, password) => {
            const newRoom = new Room_1.default(name, password);
            const isRoomWithThisNameExists = roomsData_1.default.some((room) => room.name === name);
            if (isRoomWithThisNameExists) {
                new Error_1.default(this.socket, "Room with this name already exists", 409);
            }
            else {
                roomsData_1.default.push(newRoom);
                this.io.emit("get-rooms", this.getRooms());
            }
        };
        this.joinRoom = (roomId, userId, password) => {
            this.room = (0, getRoomByRoomId_1.default)(roomId);
            this.user = (0, getUserByUserId_1.default)(userId);
            if (this.room.contains(this.user)) {
                this.socket.join(this.room.id);
                this.socket.emit("update-room", this.room.getRoomInfo());
                this.io.emit("get-rooms", this.getRooms());
            }
            else {
                if (+this.room.password !== +password) {
                    new Error_1.default(this.socket, "Password is incorrect", 401);
                    return;
                }
                this.user.room = this.room.id;
                this.room.joinRoom(this.user);
                this.socket.join(this.room.id);
                this.socket.emit("update-room", this.room.getRoomInfo());
                this.io.emit("get-rooms", this.getRooms());
            }
            if (this.room.isGameStarted) {
                this.socket.emit("update-cards", this.room.cardset);
            }
        };
        this.leaveRoom = () => {
            if (this.user && this.room) {
                this.user.leaveRoom();
                this.room.leaveRoom(this.user);
                this.socket.leave(this.room.id);
                this.socket.emit("leave-from-room");
                this.io.emit("get-rooms", this.getRooms());
            }
            else
                new Error_1.default(this.socket, "User or room not found", 404);
        };
    }
}
exports.default = RoomController;
