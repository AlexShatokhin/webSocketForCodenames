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
        this.startGame = (roomId, words) => {
            this.room = (0, getRoomByRoomId_1.default)(roomId);
            this.room.cardset = JSON.parse(words);
            const redTeam = this.room.getTeamInRoom("red");
            const blueTeam = this.room.getTeamInRoom("blue");
            const usersLimit = this.room.usersInRoom >= 4;
            const redTeamCheck = this.checkTeam(redTeam);
            const blueTeamCheck = this.checkTeam(blueTeam);
            if (true) {
                this.room.isGameStarted = true;
                this.io.in(this.room.id).emit("game-started");
            }
            else
                new Error_1.default(this.socket, "Не все пользователи выбрали команду или команды не полные", 403);
        };
        this.clickCardHandler = (word, userId) => {
            var _a, _b;
            if (this.room) {
                this.room.cardset = (_a = this.room.cardset) === null || _a === void 0 ? void 0 : _a.map((card) => {
                    if (card.word === word.word) {
                        const updatedWord = Object.assign({}, card);
                        updatedWord.isClicked = true;
                        return updatedWord;
                    }
                    return card;
                });
                this.io.in((_b = this.room) === null || _b === void 0 ? void 0 : _b.id).emit("update-cards", this.room.cardset);
            }
            else
                new Error_1.default(this.socket, "Room not found", 404);
        };
    }
    checkTeam(team) {
        return team.length >= 2 && team.some(user => user.role === "captain");
    }
}
exports.default = GameController;
