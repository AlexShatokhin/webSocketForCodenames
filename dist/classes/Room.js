"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { v4: uuidv4 } = require('uuid');
class Room {
    constructor(name = "new", limit = 3, wordset = []) {
        this.usersInRoom = 0;
        this.getRoomInfo = () => ({
            id: this.id,
            name: this.name,
            limit: this.limit,
            usersInRoom: this.usersInRoom,
            cardset: this.cardset
        });
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
            socket.emit("joined-room", this.id);
            return;
        }
        else {
            socket.emit("room-full");
        }
    }
    leaveRoom(socket) {
        socket.leave(this.id.toString());
        this.usersInRoom--;
        socket.emit("leave-from-room");
    }
}
exports.default = Room;
