import { Server, Socket } from "socket.io";

import { getRooms } from "../data/roomsData";
import { setRooms } from "../data/roomsData";

import Room from "../classes/Room";
import User from "../classes/User";
import Error from "../classes/Error";

import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import getUserByUserId from "../utils/user/getUserByUserId";
import { statusType } from "../types/statusType";
import { wordSetType } from "../types/wordSetType";
import { Request } from "express";
import getConvertedRooms from "../utils/room/getConvertedRooms";

class RoomController {
    private room : Room | undefined;
    public user : User | undefined;

    constructor(private io : Server, 
                private socket : Socket){}

    getRooms = () => getConvertedRooms();

    createRoom = (name: string, password: number, roomLang: wordSetType, callback: (a: statusType) => void) =>{
        if(roomLang !== "en" && roomLang !== "ru" && roomLang !== "uk")
            roomLang = "en";

        const request = this.socket.request as Request;
        const userId = request.sessionID;
        const newRoom = new Room(name, password, this.deleteRoom, roomLang, userId);
        const isRoomWithThisNameExists = getRooms().some((room : Room) => room.name === name);
        if(isRoomWithThisNameExists){
            new Error(this.socket, "Room with this name already exists", 409);
            callback({
                statusCode: 409,
                ok: false
            })
        } else {
            this.user = getUserByUserId(userId);
            this.user.isCreator = true;
            const updatedRooms = [...getRooms(), newRoom];
            setRooms(updatedRooms);
            this.joinRoom(newRoom.id, newRoom.password, callback)
            this.io.in("main").emit("get-rooms", this.getRooms());
            callback({
                statusCode: 200,
                ok: true
            })
        }
    }

    joinRoom = (roomId : string,  password: number, callback: (a: statusType) => void) => {
        const request = this.socket.request as Request;
        const userId = request.sessionID;

        this.room = getRoomByRoomId(roomId);
        this.user = getUserByUserId(userId);

        if(!this.room){
            new Error(this.socket, "Room not found", 404);
            callback({
                statusCode: 404,
                ok: false
            });
            return;
        }

        if(this.room.usersInRoom >= 20){
            new Error(this.socket, "Room is full", 403);
            callback({
                statusCode: 403,
                ok: false
            })
            return;
        }

        if(this.room.contains(this.user)){
            this.socket.leave("main");
            this.socket.join(this.room.id);
            this.socket.emit("update-room", this.room.getRoomInfo());
            this.io.in("main").emit("get-rooms", this.getRooms());
            
        } else {
            if(+this.room.password !== +password){
                new Error(this.socket, "Password is incorrect", 401);
                callback({
                    statusCode: 401,
                    ok: false
                })
                return;
            }
    
            this.user.room = this.room.id;
            this.room.joinRoom(this.user);
    
            this.socket.leave("main");
            this.socket.join(this.room.id);
            this.io.in(this.room.id).emit("update-room", this.room.getRoomInfo());
            this.io.in("main").emit("get-rooms", this.getRooms());
            this.room.updateRoomLifeCycle();
            callback({
                statusCode: 200,
                ok: true
            })
        }

        if(this.room.isGameStarted){
            this.socket.emit("update-room", this.room.getRoomInfo())
        }
    }

    leaveRoom = (callback: (a: statusType) => void) => {
        if(this.user && this.room){
            this.user.leaveRoom();
            this.room.leaveRoom(this.user);
    
            if(this.user.isCreator){
                this.user.isCreator = false;
                if(this.room.users.length > 0){
                    this.room.users[0].isCreator = true;
                    this.room.creator = this.room.users[0].id
                } else this.room.creator = "";

            }

            this.socket.leave(this.room.id);
            this.socket.join("main");
            this.socket.emit("leave-from-room");
    
            this.io.in(this.room.id).emit("update-room", this.room.getRoomInfo())
            this.io.in("main").emit("get-rooms", this.getRooms());
            callback({
                statusCode: 200,
                ok: true
            })
        } else{
            new Error(this.socket, "User or room not found", 404);

            callback({
                statusCode: 401,
                ok: false
            })
        }
    }

    deleteRoom = (roomID : string) => {
        if(roomID){
            const currentRoom = getRoomByRoomId(roomID);
            this.user!.isCreator = false;
            currentRoom.users.forEach((user : User) => {
                user.leaveRoom();
                this.socket.leave(currentRoom.id);
                this.socket.join("main");
                this.socket.emit("leave-from-room");
            });
            setRooms(getRooms().filter((room : Room) => room.id !== currentRoom.id));
            this.io.in("main").emit("get-rooms", this.getRooms());
            new Error(this.socket, "Room session ended", 408);

        }
    }
}

export default RoomController