"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { v4: uuidv4 } = require('uuid');
class Room {
    constructor(name = "new", password, wordset = []) {
        this.users = [];
        this.usersInRoom = 0;
        this.isGameStarted = false;
        this.getRoomInfo = () => ({
            id: this.id,
            name: this.name,
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
    }
    joinRoom(user) {
        this.users.push(user);
        this.usersInRoom++;
    }
    leaveRoom(user) {
        this.users = this.users.filter(userInRoom => userInRoom.id !== user.id);
        this.usersInRoom--;
    }
    contains(user) {
        return this.users.some((userInRoom) => userInRoom.id === user.id);
    }
}
exports.default = Room;
