"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(id, name = "Anonymous") {
        this.id = id;
        this.name = name;
        this.room = null;
        this.team = null;
        this.role = "player";
        this.isCreator = false;
        this.getUserInfo = () => ({
            id: this.id,
            name: this.name,
            room: this.room,
            team: this.team,
            role: this.role,
            isCreator: this.isCreator
        });
    }
    joinTeam(team) { this.team = team; this.role = "player"; }
    leaveRoom() {
        this.room = null;
        this.team = null;
        this.role = "player";
    }
}
exports.default = User;
