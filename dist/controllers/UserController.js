"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersData_1 = require("./../data/usersData");
const usersData_2 = __importDefault(require("../data/usersData"));
const User_1 = __importDefault(require("../classes/User"));
const Error_1 = __importDefault(require("../classes/Error"));
const getRoomByRoomId_1 = __importDefault(require("../utils/room/getRoomByRoomId"));
const getUserByUserId_1 = __importDefault(require("../utils/user/getUserByUserId"));
const errors_1 = __importDefault(require("../data/errors"));
const serverConfig_1 = __importDefault(require("../data/serverConfig"));
class UserController {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.getUsers = () => usersData_2.default;
        this.newUser = (name, sessionID, callback) => {
            const newUser = new User_1.default(sessionID, name);
            this.user = newUser;
            usersData_2.default.push(newUser);
            this.socket.emit("get-user-info", newUser.getUserInfo());
            this.socket.join("main");
            if (callback)
                callback({
                    statusCode: 200,
                    ok: true
                });
        };
        this.changeUserName = (newName, callback) => {
            const request = this.socket.request;
            const user = (0, getUserByUserId_1.default)(request.sessionID);
            user.name = newName;
            (0, usersData_1.editUser)(user);
            this.socket.emit("get-user-info", user.getUserInfo());
            if (callback) {
                callback({
                    statusCode: 200,
                    ok: true
                });
            }
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
                new Error_1.default(this.socket, errors_1.default[serverConfig_1.default.serverLanguage]["User not found"], 404);
                if (callback)
                    callback({
                        statusCode: 404,
                        ok: false
                    });
            }
        };
        this.getCaptainRole = (role = "captain") => {
            const request = this.socket.request;
            const user = (0, getUserByUserId_1.default)(request.sessionID);
            if (user) {
                const userRoom = (0, getRoomByRoomId_1.default)(user.room);
                if (user.team) {
                    const teamCaptain = userRoom.getTeamInRoom(user.team).find(user => user.role === "captain");
                    console.log(role);
                    if (teamCaptain && role === "captain") {
                        new Error_1.default(this.socket, errors_1.default[serverConfig_1.default.serverLanguage]["Team already has a captain"], 409);
                        return;
                    }
                    user.role = role;
                    (0, usersData_1.editUser)(user);
                    this.io.in(user.room).emit("toggle-roles");
                }
                else
                    new Error_1.default(this.socket, errors_1.default[serverConfig_1.default.serverLanguage]["User is not in the team"], 403);
                this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo());
                this.socket.emit("get-user-info", user.getUserInfo());
            }
            else
                new Error_1.default(this.socket, errors_1.default[serverConfig_1.default.serverLanguage]["User not found"], 404);
        };
        this.toggleReadyStatus = () => {
            if (this.user) {
                this.socket.emit("get-user-info", this.user.getUserInfo());
            }
        };
    }
}
exports.default = UserController;
