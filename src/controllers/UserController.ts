import { Server, Socket } from "socket.io";
import users from "../data/usersData";
import User from "../classes/User";
import Error from "../classes/Error";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import getUserByUserId from "../utils/user/getUserByUserId";

class UserController {
    public user : User | undefined;
    constructor(private io: Server,
                private socket: Socket){}

    getUsers = () => users;

    newUser = (name: string, sessionID : string) => {
        const newUser = new User(sessionID, name);
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
            new Error(this.socket, "User not found", 404);

    }

    getCaptainRole = () => {
        if(this.user){
            const userRoom = getRoomByRoomId(this.user.room as string);
            if(this.user.team){
                const isTeamHasCaptain = userRoom.getTeamInRoom(this.user.team).some(user => user.role === "captain");
                if(!isTeamHasCaptain)
                {
                    this.user.role = "captain";
                    this.io.in(this.user.room as string).emit("toggle-roles")
                } else
                    new Error(this.socket, "Team already has a captain", 409);
            } else
                new Error(this.socket, "User has no team", 403);
            this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo())
        } else 
            new Error(this.socket, "User not found", 404);
    }


}

export default UserController;