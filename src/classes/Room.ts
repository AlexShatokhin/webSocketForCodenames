import { Socket } from "socket.io";
import Wordset from "./Wordset";

const { v4: uuidv4 } = require('uuid');

class Room {
    public id : number;
    public cardset : Wordset[];
    public name : string;
    public limit: number;
    public usersInRoom: number = 0;

    constructor(name: string = "new", limit : number = 3, wordset : Wordset[]=[],){
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
        usersInRoom: this.usersInRoom,
        cardset: this.cardset
    })

    joinRoom(socket : Socket){
        if(this.usersInRoom < this.limit){
            socket.join(this.id.toString());
            this.usersInRoom++;
            socket.emit("joined-room", this.id);
            return;
        } else {
            socket.emit("room-full")
        }
    }

    leaveRoom(socket: Socket){
        socket.leave(this.id.toString());
        this.usersInRoom--;
        socket.emit("leave-from-room");
    }
}

export default Room