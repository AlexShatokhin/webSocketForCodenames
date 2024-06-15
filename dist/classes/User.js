"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(id, name = "Anonymous") {
        this.id = id;
        this.name = name;
        this.role = "player";
        this.getUserInfo = () => ({
            id: this.id,
            name: this.name,
            room: this.room,
            team: this.team,
            role: this.role
        });
    }
    joinTeam(team) { this.team = team; this.role = "player"; }
    leaveRoom() {
        this.room = undefined;
        this.team = undefined;
        this.role = "player";
    }
}
exports.default = User;
