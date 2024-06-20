import { Server, Socket } from "socket.io";
import Room from "../classes/Room";
import User from "../classes/User";
import Error from "../classes/Error";
import getUserByUserId from "../utils/user/getUserByUserId";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";

class GameController {
    public user : User | undefined;
    private room : Room | undefined;

    constructor(private io : Server,
                private socket : Socket
    ){}

    startGame = () => {
        this.user = getUserByUserId(this.socket.id);
        this.room = getRoomByRoomId(this.user.room as string);

        const redTeam = this.room.getTeamInRoom("red");
        const blueTeam = this.room.getTeamInRoom("blue");

        const usersLimit = this.room.usersInRoom >= 4;
        const redTeamCheck = this.checkTeam(redTeam);
        const blueTeamCheck = this.checkTeam(blueTeam);

        if(usersLimit && redTeamCheck && blueTeamCheck)
            this.io.in(this.room.id).emit("game-started")
        else 
            this.io.in(this.room.id).emit("error", new Error("Не все пользователи выбрали команду или команды не полные", 403))
    }

    checkTeam(team: User[]){
        return team.length >= 2 && team.some(user => user.role === "captain");
    }
}

export default GameController;