import { editUser } from './../data/usersData';
import { Server, Socket } from "socket.io";
import users from "../data/usersData";
import User from "../classes/User";
import Error from "../classes/Error";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import { statusType } from "../types/statusType";
import { roleType } from "../types/roleType";
import getUserByUserId from "../utils/user/getUserByUserId";
import { Request } from 'express';
import errors from '../data/errors';

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

    changeUserName = (newName: string, callback: (a: statusType) => void) => {
        const request = this.socket.request as Request;
        const user = getUserByUserId(request.sessionID);
        user.name = newName;
        editUser(user);
        this.socket.emit("get-user-info", user.getUserInfo());

        if(callback){
            callback({
                statusCode: 200,
                ok: true
            })
        }
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
            new Error(this.socket, errors.USER_NOT_FOUND);
            if(callback)
                callback({
                    statusCode: 404,
                    ok: false
                })
        }

    }

    getCaptainRole = (role : roleType = "captain") => {
        const request = this.socket.request as Request;
        const user = getUserByUserId(request.sessionID);
        if(user){
            const userRoom = getRoomByRoomId(user.room as string);
            if(user.team){
                const teamCaptain = userRoom.getTeamInRoom(user.team).find(user => user.role === "captain");
                console.log(role)
                if(teamCaptain && role === "captain"){
                    // teamCaptain.role = "player";
                    // editUser(teamCaptain);
                    new Error(this.socket, errors.TEAM_ALREADY_HAS_CAPTAIN);
                    return;
                }

                user.role = role;
                editUser(user);
                this.io.in(user.room as string).emit("toggle-roles")
                    
            } else
                new Error(this.socket, errors.USER_NOT_IN_TEAM);

            this.io.in(userRoom.id).emit("update-room", userRoom.getRoomInfo());
            this.socket.emit("get-user-info", user.getUserInfo())
        } else 
            new Error(this.socket, errors.USER_NOT_FOUND);
    }

    toggleReadyStatus = () => {
        if(this.user){
            this.socket.emit("get-user-info", this.user.getUserInfo())
        }
    }

}

export default UserController;