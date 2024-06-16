import { Server, Socket } from "socket.io";
import users from "../data/usersData";
import User from "../classes/User";
import Error from "../classes/Error";
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
        
        this.socket.emit("get-user-info", newUser.getUserInfo())
    }

    joinTeam = (team : "red" | "blue") => {
        if(this.user){
            this.user.joinTeam(team);
            const userRoom = getRoomByRoomId(this.user.room as string);
            this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo())
        } else
            this.socket.emit("error", new Error("User not found", 404).getError());

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
                            } else
                                this.socket.emit("error", new Error("Team already has a captain", 409).getError());
                        } else
                            this.socket.emit("error", new Error("User has no team", 403).getError());
                        break;
                default: 
                    this.user.role = role; 
                    this.io.in(this.user.room as string).emit("toggle-roles")
                    break;
            }
            this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo())
        } else 
            this.socket.emit("error", new Error("User not found", 404).getError());
    }

}

export default UserController;