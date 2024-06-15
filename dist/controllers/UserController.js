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
        this.newUser = (name) => {
            const newUser = new User_1.default(this.socket.id, name);
            this.user = newUser;
            usersData_1.default.push(newUser);
            this.socket.emit("get-user", newUser.getUserInfo());
        };
        this.joinTeam = (team) => {
            if (this.user) {
                this.user.joinTeam(team);
                const userRoom = (0, getRoomByRoomId_1.default)(this.user.room);
                this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo());
            }
            else
                this.socket.emit("error", new Error_1.default("User not found", 404).getError());
        };
        this.toggleRole = (role) => {
            if (this.user) {
                const userRoom = (0, getRoomByRoomId_1.default)(this.user.room);
                switch (role) {
                    case "captain":
                        if (this.user.team) {
                            const userTeammates = userRoom.getTeamInRoom(this.user.team).map(user => user.role);
                            if (userTeammates.indexOf("captain") == -1) {
                                this.user.role = "captain";
                                this.io.in(this.user.room).emit("toggle-roles");
                            }
                            else
                                this.socket.emit("error", new Error_1.default("Team already has a captain", 409).getError());
                        }
                        else
                            this.socket.emit("error", new Error_1.default("User has no team", 403).getError());
                        break;
                    default:
                        this.user.role = role;
                        this.io.in(this.user.room).emit("toggle-roles");
                        break;
                }
                this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo());
            }
            else
                this.socket.emit("error", new Error_1.default("User not found", 404).getError());
        };
    }
}
exports.default = UserController;
