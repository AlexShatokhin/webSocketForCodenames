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
        this.cards = [];
        this.remainingWordsCount = { red: 0, blue: 0, neutral: 0, black: 0 };
        this.startGame = (roomId, words) => {
            this.room = (0, getRoomByRoomId_1.default)(roomId);
            this.room.cardset = JSON.parse(words);
            this.cards = JSON.parse(words);
            const redTeam = this.room.getTeamInRoom("red");
            const blueTeam = this.room.getTeamInRoom("blue");
            const usersLimit = this.room.usersInRoom >= 4;
            const redTeamCheck = this.checkTeam(redTeam);
            const blueTeamCheck = this.checkTeam(blueTeam);
            const allUsersReadyCheck = this.room.users.every((player) => player.isReady);
            if (true) {
                this.room.isGameStarted = true;
                this.io.in(this.room.id).emit("game-started");
            }
            else
                new Error_1.default(this.socket, "Не все пользователи выбрали команду или команды не полные", 403);
        };
        this.finishGame = (winnerTeam) => {
            var _a;
            if ((_a = this.room) === null || _a === void 0 ? void 0 : _a.isGameStarted) {
                this.room.isGameStarted = false;
                this.io.in(this.room.id).emit("finish-game", winnerTeam);
            }
        };
        this.clickCardHandler = (word) => {
            var _a, _b;
            if ((_a = this.room) === null || _a === void 0 ? void 0 : _a.isGameStarted) {
                this.cards = this.cards.map((card) => {
                    if (card.word === word.word) {
                        const updatedWord = Object.assign({}, card);
                        updatedWord.isClicked = true;
                        return updatedWord;
                    }
                    return card;
                });
                this.getTeamCardsCount();
                for (let team in this.remainingWordsCount) {
                    if (team !== "neutral") {
                        if (this.remainingWordsCount[team] === 0) {
                            this.finishGame(team);
                        }
                    }
                }
                if (this.room.isGameStarted)
                    this.io.in((_b = this.room) === null || _b === void 0 ? void 0 : _b.id).emit("update-cards", this.cards, this.remainingWordsCount);
            }
            else
                new Error_1.default(this.socket, "Room not found", 404);
        };
        this.getTeamCardsCount = () => {
            this.remainingWordsCount = { red: 0, blue: 0, neutral: 0, black: 0 };
            if (this.cards.length)
                this.cards
                    .filter((card) => !card.isClicked)
                    .forEach((card) => this.remainingWordsCount[card.teamName]++);
        };
    }
    checkTeam(team) {
        return team.length >= 2 && team.some(user => user.role === "captain");
    }
}
exports.default = GameController;
