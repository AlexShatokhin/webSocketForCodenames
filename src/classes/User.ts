import { roleType } from "../types/roleType";
import { teamType } from "../types/teamType";
import { UserPublicInfoType } from "../types/UserPublicInfoType";
import { Socket } from "socket.io";


class User {
    public room: number | undefined;
    public team: teamType | undefined;
    public role: roleType | undefined;

    constructor(public socket: Socket,
                public id: string,
                public name: string = "Anonymous"
    ){}

    getUserInfo = () : UserPublicInfoType => ({
        id: this.id,
        name: this.name,
        room: this.room,
        team: this.team,
        role: this.role
    })

    getUserId(){return this.id}

    joinRoom(room: number){this.room = room}
    joinTeam(team: teamType){this.team = team}
    joinRole(role: roleType){this.role = role}

    leaveRoom(){
        this.room = undefined;
        this.team = undefined;
        this.role = undefined;
    }
}

export default User;