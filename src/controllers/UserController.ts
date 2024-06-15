import { Server, Socket } from "socket.io";
import users from "../data/usersData";
import User from "../classes/User";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import { roleType } from "../types/roleType";

class UserController {
    private user : User | undefined;
    constructor(private io: Server,
                private socket: Socket){}

    getUsers = () => users;

    newUser = (name: string) => {
        const newUser = new User(this.socket.id, name);
        this.user = newUser;
        users.push(newUser);
        
        this.socket.emit("get-user", newUser.getUserInfo())
    }

    joinTeam = (team : "red" | "blue") => {
        if(this.user){
            this.user.joinTeam(team);
            const userRoom = getRoomByRoomId(this.user.room as string);
            this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo())
        }

    }

    toggleRole = (role: roleType) => {
        if(this.user){
            const userRoom = getRoomByRoomId(this.user.room as string);
            switch(role){
                case "captain": 
                        if(this.user.team){
                            const userTeammates = userRoom.getTeamInRoom(this.user.team).map(user => user.role);
                            if(userTeammates.indexOf("captain") == -1)
                            {
                                this.user.role = "captain";
                                this.io.in(this.user.room as string).emit("toggle-roles")
                            } else {
                                this.socket.emit("toggle-roles-error")
                            }
                        };
                        break;
                default: 
                    this.user.role = role; 
                    this.io.in(this.user.room as string).emit("toggle-roles")
                    break;
            }
            this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo())
        }
    }

}

export default UserController;