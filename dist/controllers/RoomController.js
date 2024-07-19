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
        this.createRoom = (name, password, callback) => {
            const newRoom = new Room_1.default(name, password);
            const isRoomWithThisNameExists = roomsData_1.default.some((room) => room.name === name);
            if (isRoomWithThisNameExists) {
                new Error_1.default(this.socket, "Room with this name already exists", 409);
                callback({
                    statusCode: 409,
                    ok: false
                });
            }
            else {
                roomsData_1.default.push(newRoom);
                this.io.emit("get-rooms", this.getRooms());
                callback({
                    statusCode: 200,
                    ok: true
                });
            }
        };
        this.joinRoom = (roomId, userId, password, callback) => {
            this.room = (0, getRoomByRoomId_1.default)(roomId);
            this.user = (0, getUserByUserId_1.default)(userId);
            console.log(`roomId: ${roomId}(${typeof roomId})\nuserId: ${userId}(${typeof userId}\npassword: ${password}(${typeof password}`);
            console.log(callback);
            console.log(typeof callback);
            if (!this.room) {
                callback({
                    statusCode: 404,
                    ok: false
                });
                return;
            }
            if (this.room.contains(this.user)) {
                this.socket.join(this.room.id);
                this.socket.emit("update-room", this.room.getRoomInfo());
                this.io.emit("get-rooms", this.getRooms());
            }
            else {
                if (+this.room.password !== +password) {
                    new Error_1.default(this.socket, "Password is incorrect", 401);
                    callback({
                        statusCode: 401,
                        ok: false
                    });
                    return;
                }
                this.user.room = this.room.id;
                this.room.joinRoom(this.user);
                this.socket.join(this.room.id);
                this.socket.emit("update-room", this.room.getRoomInfo());
                this.io.emit("get-rooms", this.getRooms());
                callback({
                    statusCode: 200,
                    ok: true
                });
            }
            if (this.room.isGameStarted) {
                this.socket.emit("update-cards", this.room.cardset);
            }
        };
        this.leaveRoom = (callback) => {
            if (this.user && this.room) {
                this.user.leaveRoom();
                this.room.leaveRoom(this.user);
                this.socket.leave(this.room.id);
                this.socket.emit("leave-from-room");
                this.io.emit("get-rooms", this.getRooms());
                callback({
                    statusCode: 200,
                    ok: true
                });
            }
            else {
                new Error_1.default(this.socket, "User or room not found", 404);
                callback({
                    statusCode: 401,
                    ok: false
                });
            }
        };
    }
}
exports.default = RoomController;
