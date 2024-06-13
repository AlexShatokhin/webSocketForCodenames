"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(socket, id, name = "Anonymous") {
        this.socket = socket;
        this.id = id;
        this.name = name;
        this.getUserInfo = () => ({
            id: this.id,
            name: this.name,
            room: this.room,
            team: this.team,
            role: this.role
        });
    }
    getUserId() { return this.id; }
    joinRoom(room) { this.room = room; }
    joinTeam(team) { this.team = team; }
    joinRole(role) { this.role = role; }
    leaveRoom() {
        this.room = undefined;
        this.team = undefined;
        this.role = undefined;
    }
}
exports.default = User;
