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

class RoomController {
    private room : Room | undefined;
    public user : User | undefined;

    constructor(private io : Server, 
                private socket : Socket){}

    getRooms = () => {
        return getRooms().map((room : Room) => ({
            id: room.id,
            name: room.name,
            usersInRoom: room.usersInRoom,
            cardset: null,
            users: null
        }))
    };

    createRoom = (name: string, password: number, roomLang: wordSetType, userId : string, callback: (a: statusType) => void) =>{
        if(roomLang !== "en" && roomLang !== "ru" && roomLang !== "ua")
            roomLang = "en";
        const newRoom = new Room(name, password, this.deleteRoom, roomLang);
        const isRoomWithThisNameExists = getRooms().some((room : Room) => room.name === name);
        if(isRoomWithThisNameExists){
            new Error(this.socket, "Room with this name already exists", 409);
            callback({
                statusCode: 409,
                ok: false
            })
        } else {
            const updatedRooms = [...getRooms(), newRoom];
            setRooms(updatedRooms);
            this.joinRoom(newRoom.id, userId, newRoom.password, callback)
            this.io.in("main").emit("get-rooms", this.getRooms());
            callback({
                statusCode: 200,
                ok: true
            })
        }
    }

    joinRoom = (roomId : string, userId: string, password: number, callback: (a: statusType) => void) => {
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

    deleteRoom = () => {
        console.log("DELETE!")
        if(this.room){
            const currentRoom = this.room;
            this.room.users.forEach((user : User) => {
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