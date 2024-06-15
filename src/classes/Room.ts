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
    public limit: number;
    public users : User[] = [];
    public usersInRoom: number = 0;

    constructor(name: string = "new", limit : number = 3, wordset : Wordset[]=[]){
        this.id = uuidv4();
        this.name = name;
        this.cardset = wordset;
        this.limit = limit
    }

    getRoomId(){
        return this.id;
    }

    getRoomInfo = () => ({
        id: this.id,
        name: this.name,
        limit: this.limit,
        users: this.users,
        usersInRoom: this.usersInRoom,
        cardset: this.cardset
    })

    getRoomTeam = (team: teamType) => {
        return this.users.filter(user => user.team === team);
    }

    joinRoom(socket : Socket, user : User){
        if(this.usersInRoom < this.limit){
            socket.join(this.id.toString());
            this.users.push(user);
            this.usersInRoom++;
            socket.emit("joined-room", this.id);
            return;
        } else {
            socket.emit("room-full")
        }
    }

    leaveRoom(socket: Socket, user: User){
        socket.leave(this.id.toString());
        this.users = this.users.filter(userInRoom => userInRoom.id !== user.id);
        this.usersInRoom--;
        socket.emit("leave-from-room");
    }
}

export default Room