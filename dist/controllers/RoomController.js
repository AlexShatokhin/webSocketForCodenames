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
const getConvertedRooms_1 = __importDefault(require("../utils/room/getConvertedRooms"));
const errors_1 = __importDefault(require("../data/errors"));
class RoomController {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.getRooms = () => (0, getConvertedRooms_1.default)();
        this.createRoom = (name, password, roomLang, callback) => {
            if (roomLang !== "en" && roomLang !== "ru" && roomLang !== "uk")
                roomLang = "en";
            const request = this.socket.request;
            const userId = request.sessionID;
            const newRoom = new Room_1.default(name, password, this.deleteRoom, roomLang, userId);
            const isRoomWithThisNameExists = (0, roomsData_1.getRooms)().some((room) => room.name === name);
            if (isRoomWithThisNameExists) {
                new Error_1.default(this.socket, errors_1.default.ROOM_ALREADY_EXISTS);
                callback({
                    statusCode: 409,
                    ok: false
                });
            }
            else {
                this.user = (0, getUserByUserId_1.default)(userId);
                this.user.isCreator = true;
                const updatedRooms = [...(0, roomsData_1.getRooms)(), newRoom];
                (0, roomsData_2.setRooms)(updatedRooms);
                this.joinRoom(newRoom.id, newRoom.password, callback);
                this.io.in("main").emit("get-rooms", this.getRooms());
                callback({
                    statusCode: 200,
                    ok: true
                });
            }
        };
        this.joinRoom = (roomId, password, callback) => {
            const request = this.socket.request;
            const userId = request.sessionID;
            this.room = (0, getRoomByRoomId_1.default)(roomId);
            this.user = (0, getUserByUserId_1.default)(userId);
            if (!this.room) {
                new Error_1.default(this.socket, errors_1.default.ROOM_NOT_FOUND);
                callback({
                    statusCode: 404,
                    ok: false
                });
                return;
            }
            if (this.room.usersInRoom >= 20) {
                new Error_1.default(this.socket, errors_1.default.ROOM_IS_FULL);
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
                    new Error_1.default(this.socket, errors_1.default.INCORRECT_PASSWORD);
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
                if (this.user.isCreator) {
                    this.user.isCreator = false;
                    if (this.room.users.length > 0) {
                        this.room.users[0].isCreator = true;
                        this.room.creator = this.room.users[0].id;
                    }
                    else
                        this.room.creator = "";
                }
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
                new Error_1.default(this.socket, errors_1.default.USER_OR_ROOM_NOT_FOUND);
                callback({
                    statusCode: 401,
                    ok: false
                });
            }
        };
        this.deleteRoom = (roomID) => {
            if (roomID) {
                const currentRoom = (0, getRoomByRoomId_1.default)(roomID);
                this.user.isCreator = false;
                currentRoom.users.forEach((user) => {
                    user.leaveRoom();
                    this.socket.leave(currentRoom.id);
                    this.socket.join("main");
                    this.socket.emit("leave-from-room");
                });
                (0, roomsData_2.setRooms)((0, roomsData_1.getRooms)().filter((room) => room.id !== currentRoom.id));
                this.io.in("main").emit("get-rooms", this.getRooms());
                new Error_1.default(this.socket, errors_1.default.ROOM_SESSION_ENDED);
            }
        };
    }
}
exports.default = RoomController;
