import Room from "./Room";
import { Socket } from "socket.io";

type teamType = "red" | "blue";
type roleType = "captain" | "player";

class User {
    public room: Room | undefined;
    public team: teamType | undefined;
    public role: roleType | undefined;

    constructor(public socket: Socket,
                public id: string,
                public name: string = "Anonymous"
    ){}

    getUserInfo = () => ({
        id: this.id,
        name: this.name,
        room: this.room,
        team: this.team,
        role: this.role
    })

    getUserId(){return this.id}

    joinRoom(room: Room){this.room = room}
    joinTeam(team: teamType){this.team = team}
    joinRole(role: roleType){this.role = role}

    leaveRoom(){
        this.room = undefined;
        this.team = undefined;
        this.role = undefined;
    }
}

export default User;