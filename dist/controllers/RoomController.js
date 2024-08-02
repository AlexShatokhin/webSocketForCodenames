"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roomsData_1 = require("../data/roomsData");
const roomsData_2 = require("../data/roomsData");
const Room_1 = __importDefault(require("../classes/Room"));
const Error_1 = __importDefault(require("../classes/Error"));
const getRoomByRoomId_1 = __importDefault(require("../utils/room/getRoomByRoomId"));
const getUserByUserId_1 = __importDefault(require("../utils/user/getUserByUserId"));
class RoomController {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.getRooms = () => {
            return (0, roomsData_1.getRooms)().map((room) => ({
                id: room.id,
                name: room.name,
                usersInRoom: room.usersInRoom,
                cardset: null,
                users: null
            }));
        };
        this.createRoom = (name, password, callback) => {
            const newRoom = new Room_1.default(name, password, this.deleteRoom);
            const isRoomWithThisNameExists = (0, roomsData_1.getRooms)().some((room) => room.name === name);
            if (isRoomWithThisNameExists) {
                new Error_1.default(this.socket, "Room with this name already exists", 409);
                callback({
                    statusCode: 409,
                    ok: false
                });
            }
            else {
                const updatedRooms = [...(0, roomsData_1.getRooms)(), newRoom];
                (0, roomsData_2.setRooms)(updatedRooms);
                this.io.in("main").emit("get-rooms", this.getRooms());
                callback({
                    statusCode: 200,
                    ok: true
                });
            }
        };
        this.joinRoom = (roomId, userId, password, callback) => {
            this.room = (0, getRoomByRoomId_1.default)(roomId);
            this.user = (0, getUserByUserId_1.default)(userId);
            console.log("____joinRoom logs start____");
            console.log(`roomId: ${roomId}(${typeof roomId})\nuserId: ${userId}(${typeof userId}\npassword: ${password}(${typeof password})`);
            console.log(callback);
            console.log(typeof callback);
            console.log("____joinRoom logs end____");
            if (!this.room) {
                new Error_1.default(this.socket, "Room not found", 404);
                callback({
                    statusCode: 404,
                    ok: false
                });
                return;
            }
            if (this.room.usersInRoom >= 20) {
                new Error_1.default(this.socket, "Room is full", 403);
                callback({
                    statusCode: 403,
                    ok: false
                });
                return;
            }
            if (this.room.contains(this.user)) {
                this.socket.leave("main");
                this.socket.join(this.room.id);
                this.socket.emit("update-room", this.room.getRoomInfo());
                this.io.in("main").emit("get-rooms", this.getRooms());
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
                this.socket.leave("main");
                this.socket.join(this.room.id);
                this.io.in(this.room.id).emit("update-room", this.room.getRoomInfo());
                this.io.in("main").emit("get-rooms", this.getRooms());
                this.room.updateRoomLifeCycle();
                callback({
                    statusCode: 200,
                    ok: true
                });
            }
            if (this.room.isGameStarted) {
                this.socket.emit("update-room", this.room.getRoomInfo());
            }
        };
        this.leaveRoom = (callback) => {
            if (this.user && this.room) {
                this.user.leaveRoom();
                this.room.leaveRoom(this.user);
                this.socket.leave(this.room.id);
                this.socket.join("main");
                this.socket.emit("leave-from-room");
                this.io.in(this.room.id).emit("update-room", this.room.getRoomInfo());
                this.io.in("main").emit("get-rooms", this.getRooms());
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
        this.deleteRoom = () => {
            console.log("DELETE!");
            if (this.room) {
                const currentRoom = this.room;
                this.room.users.forEach((user) => {
                    user.leaveRoom();
                    this.socket.leave(currentRoom.id);
                    this.socket.join("main");
                    this.socket.emit("leave-from-room");
                });
                (0, roomsData_2.setRooms)((0, roomsData_1.getRooms)().filter((room) => room.id !== currentRoom.id));
                this.io.in("main").emit("get-rooms", this.getRooms());
                new Error_1.default(this.socket, "Room session ended", 408);
            }
        };
    }
}
exports.default = RoomController;
