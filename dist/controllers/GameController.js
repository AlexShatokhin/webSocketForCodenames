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
            const redTeam = this.room.getTeamInRoom("red");
            const blueTeam = this.room.getTeamInRoom("blue");
            const usersLimit = this.room.usersInRoom >= 4;
            const redTeamCheck = this.checkTeam(redTeam);
            const blueTeamCheck = this.checkTeam(blueTeam);
            this.io.in(this.room.id)
                .emit(usersLimit && redTeamCheck && blueTeamCheck ? "game-started" : "game-started-error");
        };
    }
    checkTeam(team) {
        return team.length >= 2 && team.some(user => user.role === "captain");
    }
}
exports.default = GameController;
