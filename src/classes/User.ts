import { roleType } from "../types/roleType";
import { teamType } from "../types/teamType";
import { UserPublicInfoType } from "../types/UserPublicInfoType";


class User {

    public room: string | undefined;
    public team: teamType | undefined;
    public role: roleType = "player";

    constructor(public id: string,
                public name: string = "Anonymous"){}

    getUserInfo = () : UserPublicInfoType => ({
        id: this.id,
        name: this.name,
        room: this.room,
        team: this.team,
        role: this.role
    })

    joinTeam(team: teamType){this.team = team; this.role = "player"}

    leaveRoom(){
        this.room = undefined;
        this.team = undefined;
        this.role = "player";
    }
}

export default User;