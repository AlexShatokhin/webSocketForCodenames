"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { v4: uuidv4 } = require('uuid');
class Room {
    constructor(name = "new", password, limit = 4, wordset = []) {
        this.users = [];
        this.usersInRoom = 0;
        this.getRoomInfo = () => ({
            id: this.id,
            name: this.name,
            limit: this.limit,
            users: this.users,
            usersInRoom: this.usersInRoom,
            cardset: this.cardset
        });
        this.getTeamInRoom = (team) => {
            return this.users.filter(user => user.team === team);
        };
        this.id = uuidv4();
        this.name = name;
        this.password = password;
        this.cardset = wordset;
        this.limit = limit;
    }
    joinRoom(user) {
        this.users.push(user);
        this.usersInRoom++;
    }
    isRoomFull() {
        return this.usersInRoom === this.limit;
    }
    leaveRoom(user) {
        this.users = this.users.filter(userInRoom => userInRoom.id !== user.id);
        this.usersInRoom--;
    }
}
exports.default = Room;
