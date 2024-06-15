"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getUserByUserId_1 = __importDefault(require("../utils/user/getUserByUserId"));
const getRoomByRoomId_1 = __importDefault(require("../utils/room/getRoomByRoomId"));
class GameController {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.startGame = () => {
            this.user = (0, getUserByUserId_1.default)(this.socket.id);
            this.room = (0, getRoomByRoomId_1.default)(this.user.room);
            const redTeam = this.room.getRoomTeam("red");
            const blueTeam = this.room.getRoomTeam("blue");
            const usersLimit = this.room.usersInRoom >= 4;
            const redTeamCheck = redTeam.length >= 2 && redTeam.some(user => user.role === "captain");
            const blueTeamCheck = blueTeam.length >= 2 && blueTeam.some(user => user.role === "captain");
            if (usersLimit && redTeamCheck && blueTeamCheck) {
                this.io.in(this.room.id).emit("game-started");
            }
            else {
                this.io.in(this.room.id).emit("game-started-error");
            }
        };
    }
}
exports.default = GameController;
