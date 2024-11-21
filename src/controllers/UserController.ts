import { editUser } from './../data/usersData';
import { Server, Socket } from "socket.io";
import users from "../data/usersData";
import User from "../classes/User";
import Error from "../classes/Error";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import { statusType } from "../types/statusType";
import { roleType } from "../types/roleType";
import getUserByUserId from "../utils/user/getUserByUserId";

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
        this.socket.join("main");
        if(callback)
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
            if(callback)
                callback({
                    statusCode: 200,
                    ok: true
                })
        } else {
            new Error(this.socket, "User not found", 404);
            if(callback)
                callback({
                    statusCode: 404,
                    ok: false
                })
        }

    }

    getCaptainRole = (userID : string, role : roleType = "captain") => {
        const user = getUserByUserId(userID);
        console.log(userID)
        if(user){
            const userRoom = getRoomByRoomId(user.room as string);
            if(user.team){
                const teamCaptain = userRoom.getTeamInRoom(user.team).find(user => user.role === "captain");
                console.log(role)
                if(teamCaptain && role === "captain"){
                    // teamCaptain.role = "player";
                    // editUser(teamCaptain);
                    new Error(this.socket, "Team already has a captain", 409);
                    return;
                }

                user.role = role;
                editUser(user);
                this.io.in(user.room as string).emit("toggle-roles")
                    
            } else
                new Error(this.socket, "User has no team", 403);

            this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo());
            this.socket.emit("get-user-info", user.getUserInfo())
        } else 
            new Error(this.socket, "User not found", 404);
    }

    toggleReadyStatus = () => {
        if(this.user){
            this.socket.emit("get-user-info", this.user.getUserInfo())
        }
    }

}

export default UserController;