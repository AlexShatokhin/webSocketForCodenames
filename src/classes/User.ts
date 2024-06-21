import { roleType } from "../types/roleType";
import { teamType } from "../types/teamType";
import { UserPublicInfoType } from "../types/UserPublicInfoType";


class User {

    public room: string | undefined;
    public team: teamType | undefined;
    public role: roleType = "player";
    public isReady : boolean = false;

    constructor(public id: string,
                public name: string = "Anonymous"){}

    getUserInfo = () : UserPublicInfoType => ({
        id: this.id,
        name: this.name,
        room: this.room,
        team: this.team,
        role: this.role,
        isReady: this.isReady
    })

    joinTeam(team: teamType){this.team = team; this.role = "player"; this.isReady = false}

    leaveRoom(){
        this.room = undefined;
        this.team = undefined;
        this.role = "player";
        this.isReady = false;
    }
}

export default User;