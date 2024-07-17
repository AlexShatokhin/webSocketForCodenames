"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersData_1 = __importDefault(require("../data/usersData"));
const User_1 = __importDefault(require("../classes/User"));
const Error_1 = __importDefault(require("../classes/Error"));
const getRoomByRoomId_1 = __importDefault(require("../utils/room/getRoomByRoomId"));
class UserController {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.getUsers = () => usersData_1.default;
        this.newUser = (name, sessionID, callback) => {
            const newUser = new User_1.default(sessionID, name);
            this.user = newUser;
            usersData_1.default.push(newUser);
            this.socket.emit("get-user-info", newUser.getUserInfo());
            if (callback)
                callback({
                    statusCode: 200,
                    ok: true
                });
        };
        this.joinTeam = (team, callback) => {
            if (this.user) {
                this.user.joinTeam(team);
                const userRoom = (0, getRoomByRoomId_1.default)(this.user.room);
                this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo());
                this.socket.emit("get-user-info", this.user.getUserInfo());
                if (callback)
                    callback({
                        statusCode: 200,
                        ok: true
                    });
            }
            else {
                new Error_1.default(this.socket, "User not found", 404);
                if (callback)
                    callback({
                        statusCode: 404,
                        ok: false
                    });
            }
        };
        this.getCaptainRole = () => {
            if (this.user) {
                const userRoom = (0, getRoomByRoomId_1.default)(this.user.room);
                if (this.user.team) {
                    const isTeamHasCaptain = userRoom.getTeamInRoom(this.user.team).some(user => user.role === "captain");
                    if (!isTeamHasCaptain) {
                        this.user.role = "captain";
                        this.user.isReady = false;
                        this.io.in(this.user.room).emit("toggle-roles");
                    }
                    else
                        new Error_1.default(this.socket, "Team already has a captain", 409);
                }
                else
                    new Error_1.default(this.socket, "User has no team", 403);
                this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo());
                this.socket.emit("get-user-info", this.user.getUserInfo());
            }
            else
                new Error_1.default(this.socket, "User not found", 404);
        };
        this.toggleReadyStatus = () => {
            if (this.user) {
                this.user.isReady = !this.user.isReady;
                this.socket.emit("get-user-info", this.user.getUserInfo());
            }
        };
    }
}
exports.default = UserController;
