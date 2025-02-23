import User from "./User";
import { teamType } from "../types/teamType";
import { Word } from "../types/Word";
import { wordSetType } from "../types/wordSetType";

const { v4: uuidv4 } = require('uuid');

class Room {
    public id : string;
    public cardset : Word[] = [];
    public name : string;
    public password : number;
    public users : User[] = [];
    public usersInRoom: number = 0;
    public isGameStarted : boolean = false;
    public isGameFinished : boolean = false; 
    public roomLifeCycle : NodeJS.Timeout;
    public roomLanguage : wordSetType = "en";
    public creator : string;


    constructor(name: string = "new", password: number, deleteCallback : (roomId: string) => void, roomLanguage : wordSetType = "en", creatorId: string){
        this.id = uuidv4();
        this.roomLanguage = roomLanguage;
        this.name = name;
        this.password = password;
        this.roomLanguage = roomLanguage;
        this.roomLifeCycle = setTimeout(() => deleteCallback(this.id), 3_600_000) // 1 hour
        this.creator = creatorId;
    }

    getRoomInfo = () => ({
        id: this.id,
        creator: this.creator,
        language: this.roomLanguage,
        name: this.name,
        users: this.users,
        usersInRoom: this.usersInRoom,
        isGameStarted: this.isGameStarted,
        isGameFinished: this.isGameFinished,
        cardset: this.cardset
    })

    getTeamInRoom = (team: teamType) => this.users.filter(user => user.team === team);

    joinRoom(user : User){
        this.users.push(user);
        this.usersInRoom++;
    }

    leaveRoom(user: User){
        this.users = this.users.filter(userInRoom => userInRoom.id !== user.id);
        this.usersInRoom--;
    }

    contains = (user: User) => this.users.some((userInRoom : User) => userInRoom.id === user.id)

    updateRoomLifeCycle = () => this.roomLifeCycle.refresh();
}

export default Room