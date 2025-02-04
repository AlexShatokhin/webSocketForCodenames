"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = __importDefault(require("../classes/Error"));
const getRoomByRoomId_1 = __importDefault(require("../utils/room/getRoomByRoomId"));
const getWordSet_1 = __importDefault(require("../utils/words/getWordSet"));
const getUserByUserId_1 = __importDefault(require("../utils/user/getUserByUserId"));
const roomsData_1 = require("../data/roomsData");
const getConvertedRooms_1 = __importDefault(require("../utils/room/getConvertedRooms"));
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
                (0, roomsData_1.changeRooms)(this.room);
                this.io.in("main").emit("get-rooms", (0, getConvertedRooms_1.default)());
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
        this.finishGame = (roomID, winnerTeam) => {
            const updatedRoom = (0, getRoomByRoomId_1.default)(roomID);
            if (updatedRoom.isGameStarted) {
                updatedRoom.isGameStarted = false;
                updatedRoom.isGameFinished = true;
                (0, roomsData_1.changeRooms)(updatedRoom);
                this.io.in("main").emit("get-rooms", (0, getConvertedRooms_1.default)());
                this.io.in(updatedRoom.id).emit("finish-game", winnerTeam);
                updatedRoom;
            }
        };
        this.clickCardHandler = (word) => {
            const request = this.socket.request;
            const userId = request.sessionID;
            const senderUser = (0, getUserByUserId_1.default)(userId);
            const updatedRoom = (0, getRoomByRoomId_1.default)(senderUser.room);
            if (updatedRoom === null || updatedRoom === void 0 ? void 0 : updatedRoom.isGameStarted) {
                updatedRoom.cardset = updatedRoom.cardset.map((card) => {
                    if (card.word === word) {
                        const updatedWord = Object.assign({}, card);
                        updatedWord.isClicked = true;
                        return updatedWord;
                    }
                    return card;
                });
                const remainingWordsCount = this.getTeamCardsCount(updatedRoom.cardset);
                console.log(remainingWordsCount);
                for (let team in remainingWordsCount) {
                    if (team !== "neutral") {
                        if (remainingWordsCount[team] === 0) {
                            if (team === "black")
                                this.finishGame(updatedRoom.id, senderUser.team === "red" ? "blue" : "red");
                            else
                                this.finishGame(updatedRoom.id, team);
                        }
                    }
                }
                (0, roomsData_1.changeRooms)(updatedRoom);
                this.io.in(updatedRoom === null || updatedRoom === void 0 ? void 0 : updatedRoom.id).emit("update-room", updatedRoom.getRoomInfo());
            }
            else
                new Error_1.default(this.socket, "Game was ended", 409);
        };
        this.getTeamCardsCount = (cards) => {
            console.log(cards);
            const remainingWordsCount = { red: 0, blue: 0, neutral: 0, black: 0 };
            if (cards.length)
                cards
                    .filter((card) => !card.isClicked)
                    .forEach((card) => remainingWordsCount[card.teamName]++);
            return remainingWordsCount;
        };
    }
    checkTeam(team) {
        return team.length >= 2 && team.length <= 10 && team.some(user => user.role === "captain");
    }
}
exports.default = GameController;
