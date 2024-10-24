"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = __importDefault(require("../classes/Error"));
const getRoomByRoomId_1 = __importDefault(require("../utils/room/getRoomByRoomId"));
const getWordSet_1 = __importDefault(require("../utils/words/getWordSet"));
class GameController {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.cards = [];
        this.remainingWordsCount = { red: 0, blue: 0, neutral: 0, black: 0 };
        this.startGame = (roomId) => {
            this.room = (0, getRoomByRoomId_1.default)(roomId);
            this.room.cardset = (0, getWordSet_1.default)(25, this.room.roomLanguage);
            this.cards = this.room.cardset;
            const redTeam = this.room.getTeamInRoom("red");
            const blueTeam = this.room.getTeamInRoom("blue");
            const usersLimit = this.room.usersInRoom >= 4;
            const redTeamCheck = this.checkTeam(redTeam);
            const blueTeamCheck = this.checkTeam(blueTeam);
            if (true) {
                this.room.isGameStarted = true;
                this.room.users.forEach(user => console.log(user));
                this.io.in(this.room.id).emit("game-started");
                this.io.in(this.room.id).emit("update-room", this.room.getRoomInfo());
                this.room.updateRoomLifeCycle();
            }
            else {
                if (!usersLimit) {
                    new Error_1.default(this.socket, "В комнате слишком мало игроков", 403);
                    return;
                }
                if (!redTeamCheck)
                    new Error_1.default(this.socket, "Команда красных неполная!", 403);
                if (!blueTeamCheck)
                    new Error_1.default(this.socket, "Команда синих неполная!", 403);
            }
        };
        this.finishGame = (winnerTeam) => {
            var _a;
            if ((_a = this.room) === null || _a === void 0 ? void 0 : _a.isGameStarted) {
                this.room.isGameStarted = false;
                this.io.in(this.room.id).emit("finish-game", winnerTeam);
            }
        };
        this.clickCardHandler = (word, senderUser) => {
            var _a, _b;
            this.room = (0, getRoomByRoomId_1.default)(senderUser.room);
            if ((_a = this.room) === null || _a === void 0 ? void 0 : _a.isGameStarted) {
                this.cards = this.cards.map((card) => {
                    if (card.word === word) {
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
                            if (team === "black")
                                this.finishGame(senderUser.team === "red" ? "blue" : "red");
                            else
                                this.finishGame(team);
                        }
                    }
                }
                this.room.cardset = this.cards;
                this.io.in((_b = this.room) === null || _b === void 0 ? void 0 : _b.id).emit("update-room", this.room.getRoomInfo());
            }
            else
                new Error_1.default(this.socket, "Game was ended", 409);
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
        return team.length >= 2 && team.length <= 10 && team.some(user => user.role === "captain");
    }
}
exports.default = GameController;
