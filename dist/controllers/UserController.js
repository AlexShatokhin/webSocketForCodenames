"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersData_1 = __importDefault(require("../data/usersData"));
const User_1 = __importDefault(require("../classes/User"));
const getRoomByRoomId_1 = __importDefault(require("../utils/room/getRoomByRoomId"));
class UserController {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
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
        };
        this.toggleRole = (role) => {
            if (this.user) {
                const userRoom = (0, getRoomByRoomId_1.default)(this.user.room);
                switch (role) {
                    case "captain":
                        if (this.user.team) {
                            const userTeammates = userRoom.getRoomTeam(this.user.team).map(user => user.role);
                            if (userTeammates.indexOf("captain") == -1) {
                                this.user.role = "captain";
                                this.io.in(this.user.room).emit("toggle-roles");
                            }
                            else {
                                this.socket.emit("toggle-roles-error");
                            }
                        }
                        ;
                        break;
                    default:
                        this.user.joinRole(role);
                        this.io.in(this.user.room).emit("toggle-roles");
                        break;
                }
                this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo());
            }
        };
    }
}
exports.default = UserController;
