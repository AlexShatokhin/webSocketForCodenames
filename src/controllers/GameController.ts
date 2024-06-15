import { Server, Socket } from "socket.io";
import Room from "../classes/Room";
import User from "../classes/User";
import getUserByUserId from "../utils/user/getUserByUserId";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";

class GameController {
    private user : User | undefined;
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

        this.io.in(this.room.id)
                .emit(usersLimit && redTeamCheck && blueTeamCheck ? "game-started" : "game-started-error");
    }

    checkTeam(team: User[]){
        return team.length >= 2 && team.some(user => user.role === "captain");
    }
}

export default GameController;