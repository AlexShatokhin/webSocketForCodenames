"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roomsData_1 = __importDefault(require("../data/roomsData"));
const getWordSet_1 = __importDefault(require("../utils/words/getWordSet"));
const getRoomIndexById_1 = __importDefault(require("../utils/room/getRoomIndexById"));
class CardsController {
    constructor(io) {
        this.io = io;
        this.getCards = (roomId) => {
            const wordset = (0, getWordSet_1.default)();
            const roomIndex = (0, getRoomIndexById_1.default)(roomId, roomsData_1.default);
            roomsData_1.default[roomIndex].cardset = wordset;
            this.io.in(roomId.toString()).emit("send-cards", wordset);
        };
    }
}
exports.default = CardsController;
