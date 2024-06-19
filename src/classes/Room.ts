import { Socket } from "socket.io";
import Wordset from "./Wordset";
import User from "./User";
import { UserPublicInfoType } from "../types/UserPublicInfoType";
import { teamType } from "../types/teamType";

const { v4: uuidv4 } = require('uuid');

class Room {
    public id : string;
    public cardset : Wordset[];
    public name : string;
    public password : number;
    public users : User[] = [];
    public usersInRoom: number = 0;

    constructor(name: string = "new", password: number, wordset : Wordset[]=[]){
        this.id = uuidv4();
        this.name = name;
        this.password = password;
        this.cardset = wordset;
    }

    getRoomInfo = () => ({
        id: this.id,
        name: this.name,
        users: this.users,
        usersInRoom: this.usersInRoom,
        cardset: this.cardset
    })

    getTeamInRoom = (team: teamType) => {
        return this.users.filter(user => user.team === team);
    }

    joinRoom(user : User){
        this.users.push(user);
        this.usersInRoom++;
    }

    leaveRoom(user: User){
        this.users = this.users.filter(userInRoom => userInRoom.id !== user.id);
        this.usersInRoom--;
    }

    contains(user: User){
        return this.users.some((userInRoom : User) => userInRoom.id === user.id)
    }
}

export default Room