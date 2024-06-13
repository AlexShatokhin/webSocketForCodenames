"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { v4: uuidv4 } = require('uuid');
class Room {
    constructor(name = "new", wordset = [], limit = 3) {
        this.usersInRoom = 0;
        this.id = uuidv4();
        this.name = name;
        this.cardset = wordset;
        this.limit = limit;
    }
    getRoomId() {
        return this.id;
    }
    joinRoom(socket) {
        if (this.usersInRoom < this.limit) {
            socket.join(this.id.toString());
            this.usersInRoom++;
            console.log(`User ${socket.id} joined room ${this.id}`);
            socket.emit("joined-room", this.id);
        }
        else {
            console.log(`Room ${this.id} is full!`);
            socket.emit("foom-full");
        }
    }
    leaveRoom(socket) {
        socket.leave(this.id.toString());
        this.usersInRoom--;
        console.log(`User leaved from room ${this.id}`);
        socket.emit("leave-from-room");
    }
}
exports.default = Room;
