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

        const redTeam = this.room.getRoomTeam("red");
        const blueTeam = this.room.getRoomTeam("blue");

        const usersLimit = this.room.usersInRoom >= 4;
        const redTeamCheck = redTeam.length >= 2 && redTeam.some(user => user.role === "captain");
        const blueTeamCheck = blueTeam.length >= 2 && blueTeam.some(user => user.role === "captain");

        if(usersLimit && redTeamCheck && blueTeamCheck){
            this.io.in(this.room.id).emit("game-started")
        } else {
            this.io.in(this.room.id).emit("game-started-error");
        }
    }
}

export default GameController;