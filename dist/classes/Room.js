"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { v4: uuidv4 } = require('uuid');
class Room {
    constructor(name = "new", wordset = [], limit = 3) {
        this.id = uuidv4();
        this.name = name;
        this.cardset = wordset;
        this.limit = limit;
    }
    getRoomId() {
        return this.id;
    }
}
exports.default = Room;
