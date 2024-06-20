"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getWordSet_1 = __importDefault(require("../utils/words/getWordSet"));
const getRoomByRoomId_1 = __importDefault(require("../utils/room/getRoomByRoomId"));
class CardsController {
    constructor(io) {
        this.io = io;
        this.getCards = (roomId, wordsetType) => {
            console.log(wordsetType);
            const wordset = (0, getWordSet_1.default)(9, wordsetType);
            const room = (0, getRoomByRoomId_1.default)(roomId);
            room.cardset = wordset;
            this.io.in(roomId).emit("get-cards", wordset);
        };
    }
}
exports.default = CardsController;
