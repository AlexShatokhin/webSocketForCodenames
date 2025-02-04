"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { v4: uuidv4 } = require('uuid');
class Room {
    constructor(name = "new", password, deleteCallback, roomLanguage = "en", creatorId) {
        this.cardset = [];
        this.users = [];
        this.usersInRoom = 0;
        this.isGameStarted = false;
        this.isGameFinished = false;
        this.roomLanguage = "en";
        this.getRoomInfo = () => ({
            id: this.id,
            creator: this.creator,
            language: this.roomLanguage,
            name: this.name,
            users: this.users,
            usersInRoom: this.usersInRoom,
            isGameStarted: this.isGameStarted,
            isGameFinished: this.isGameFinished,
            cardset: this.cardset
        });
        this.getTeamInRoom = (team) => this.users.filter(user => user.team === team);
        this.contains = (user) => this.users.some((userInRoom) => userInRoom.id === user.id);
        this.updateRoomLifeCycle = () => this.roomLifeCycle.refresh();
        this.id = uuidv4();
        this.roomLanguage = roomLanguage;
        this.name = name;
        this.password = password;
        this.roomLanguage = roomLanguage;
        this.roomLifeCycle = setTimeout(deleteCallback, 60000);
        this.creator = creatorId;
    }
    joinRoom(user) {
        this.users.push(user);
        this.usersInRoom++;
    }
    leaveRoom(user) {
        this.users = this.users.filter(userInRoom => userInRoom.id !== user.id);
        this.usersInRoom--;
    }
}
exports.default = Room;
