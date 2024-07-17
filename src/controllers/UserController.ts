import { Server, Socket } from "socket.io";
import users from "../data/usersData";
import User from "../classes/User";
import Error from "../classes/Error";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import { statusType } from "../types/statusType";

class UserController {
    public user : User | undefined;
    constructor(private io: Server,
                private socket: Socket){}

    getUsers = () => users;

    newUser = (name: string, sessionID : string, callback : (a : statusType) => void) => {
        const newUser = new User(sessionID, name);
        this.user = newUser;
        users.push(newUser);
        
        this.socket.emit("get-user-info", newUser.getUserInfo());
        callback({
            statusCode: 200,
            ok: true
        })
    }

    joinTeam = (team : "red" | "blue", callback : (a : statusType) => void) => {
        if(this.user){
            this.user.joinTeam(team);
            const userRoom = getRoomByRoomId(this.user.room as string);
            this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo());
            this.socket.emit("get-user-info", this.user.getUserInfo());
            callback({
                statusCode: 200,
                ok: true
            })
        } else {
            new Error(this.socket, "User not found", 404);
            callback({
                statusCode: 404,
                ok: false
            })
        }

    }

    getCaptainRole = () => {
        if(this.user){
            const userRoom = getRoomByRoomId(this.user.room as string);
            if(this.user.team){
                const isTeamHasCaptain = userRoom.getTeamInRoom(this.user.team).some(user => user.role === "captain");
                if(!isTeamHasCaptain)
                {
                    this.user.role = "captain";
                    this.user.isReady = false;
                    this.io.in(this.user.room as string).emit("toggle-roles")
                } else
                    new Error(this.socket, "Team already has a captain", 409);
            } else
                new Error(this.socket, "User has no team", 403);

            this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo());
            this.socket.emit("get-user-info", this.user.getUserInfo())
        } else 
            new Error(this.socket, "User not found", 404);
    }

    toggleReadyStatus = () => {
        if(this.user){
            this.user.isReady = !this.user.isReady;
            this.socket.emit("get-user-info", this.user.getUserInfo())
        }
    }

}

export default UserController;