import { Server, Socket } from "socket.io";
import Room from "../classes/Room";
import User from "../classes/User";
import Error from "../classes/Error";
import getUserByUserId from "../utils/user/getUserByUserId";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import { Word } from "../types/Word";

class GameController {
    public user : User | undefined;
    public room : Room | undefined;

    constructor(private io : Server,
                private socket : Socket){}

    startGame = (roomId : string, words : string) => {
        this.room = getRoomByRoomId(roomId);
        this.room.cardset = JSON.parse(words);

        const redTeam = this.room.getTeamInRoom("red");
        const blueTeam = this.room.getTeamInRoom("blue");

        const usersLimit = this.room.usersInRoom >= 4;
        const redTeamCheck = this.checkTeam(redTeam);
        const blueTeamCheck = this.checkTeam(blueTeam);

        if(true){
            this.room.isGameStarted = true;
            this.io.in(this.room.id).emit("game-started");
        }
        else 
            new Error(this.socket, "Не все пользователи выбрали команду или команды не полные", 403);
    
    }

    clickCardHandler = (word: Word, userId : string) => {
        if(this.room){
            this.room.cardset = this.room.cardset?.map((card : Word) => {
                if(card.word === word.word){
                    const updatedWord = {...card};
                    updatedWord.isClicked = true;
    
                    return updatedWord;
                }
                return card;
            })
    
            this.io.in(this.room?.id as string).emit("update-cards", this.room.cardset)
    
        } else new Error(this.socket, "Room not found", 404)
    }

    checkTeam(team: User[]){
        return team.length >= 2 && team.some(user => user.role === "captain");
    }
}

export default GameController;