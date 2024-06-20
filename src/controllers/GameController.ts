import { Server, Socket } from "socket.io";
import Room from "../classes/Room";
import User from "../classes/User";
import Error from "../classes/Error";
import getUserByUserId from "../utils/user/getUserByUserId";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";

class GameController {
    public user : User | undefined;
    public room : Room | undefined;
    private isGameStarted : boolean = false;

    constructor(private io : Server,
                private socket : Socket){}

    startGame = (roomId : string) => {
        this.room = getRoomByRoomId(roomId);

        const redTeam = this.room.getTeamInRoom("red");
        const blueTeam = this.room.getTeamInRoom("blue");

        const usersLimit = this.room.usersInRoom >= 4;
        const redTeamCheck = this.checkTeam(redTeam);
        const blueTeamCheck = this.checkTeam(blueTeam);

        if(true){
            this.isGameStarted = true;
            this.io.in(this.room.id).emit("game-started");
        }
        else 
            new Error(this.socket, "Не все пользователи выбрали команду или команды не полные", 403);
    
    }

    checkTeam(team: User[]){
        return team.length >= 2 && team.some(user => user.role === "captain");
    }
}

export default GameController;