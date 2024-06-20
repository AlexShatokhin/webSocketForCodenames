"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = __importDefault(require("../classes/Error"));
const getRoomByRoomId_1 = __importDefault(require("../utils/room/getRoomByRoomId"));
class GameController {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.isGameStarted = false;
        this.startGame = (roomId) => {
            this.room = (0, getRoomByRoomId_1.default)(roomId);
            const redTeam = this.room.getTeamInRoom("red");
            const blueTeam = this.room.getTeamInRoom("blue");
            const usersLimit = this.room.usersInRoom >= 4;
            const redTeamCheck = this.checkTeam(redTeam);
            const blueTeamCheck = this.checkTeam(blueTeam);
            if (true) {
                this.isGameStarted = true;
                this.io.in(this.room.id).emit("game-started");
            }
            else
                new Error_1.default(this.socket, "Не все пользователи выбрали команду или команды не полные", 403);
        };
    }
    checkTeam(team) {
        return team.length >= 2 && team.some(user => user.role === "captain");
    }
}
exports.default = GameController;
