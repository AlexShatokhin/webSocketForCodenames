import { Server, Socket } from "socket.io";
import Room from "../classes/Room";
import User from "../classes/User";
import Error from "../classes/Error";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import { Word } from "../types/Word";
import getWordSet from "../utils/words/getWordSet";
import { teamType } from "../types/teamType";

class GameController {
    public user : User | undefined;
    public room : Room | undefined;
    public cards : Word[] = [];
    public remainingWordsCount : { [key: string]: number } = { red: 0, blue: 0, neutral: 0, black: 0 }

    constructor(private io : Server,
                private socket : Socket){}


    startGame = (roomId : string) => {
        this.room = getRoomByRoomId(roomId);
        this.room.cardset = getWordSet(25, this.room.roomLanguage);
        this.cards = this.room.cardset;

        const redTeam = this.room.getTeamInRoom("red");
        const blueTeam = this.room.getTeamInRoom("blue");

        const usersLimit = this.room.usersInRoom >= 4;
        const redTeamCheck = this.checkTeam(redTeam);
        const blueTeamCheck = this.checkTeam(blueTeam);

        if(true){
            this.room.isGameStarted = true;
            this.room.users.forEach(user => console.log(user));
            this.io.in(this.room.id).emit("game-started")
            this.io.in(this.room.id).emit("update-room", this.room.getRoomInfo());
            this.room.updateRoomLifeCycle();
        }
        else {
            if(!usersLimit){
                new Error(this.socket, "В комнате слишком мало игроков", 403);
                return;
            }
            if(!redTeamCheck)
                new Error(this.socket, "Команда красных неполная!", 403);
            if(!blueTeamCheck)
                new Error(this.socket, "Команда синих неполная!", 403);
        }    
    }

    finishGame = (winnerTeam : string) => {
        if(this.room?.isGameStarted){
            this.room.isGameStarted = false;
            this.io.in(this.room.id).emit("finish-game", winnerTeam);
        }
    }

    clickCardHandler = (word: string, senderUser : User) => {
        this.room = getRoomByRoomId(senderUser.room as string);

        if(this.room?.isGameStarted){
            this.cards = this.cards.map((card : Word) => {
                if(card.word === word){
                    const updatedWord = {...card};
                    updatedWord.isClicked = true;
                    return updatedWord;
                }
                return card;
            })
            this.getTeamCardsCount();
            for(let team in this.remainingWordsCount){
                if(team !== "neutral"){
                    if(this.remainingWordsCount[team] === 0){
                        if(team === "black") 
                            this.finishGame(senderUser.team === "red" ? "blue" : "red")
                        else
                            this.finishGame(team);
                    }
                }
            }
            
            this.room.cardset = this.cards;
            this.io.in(this.room?.id as string).emit("update-room", this.room.getRoomInfo())
    
        } else new Error(this.socket, "Game was ended", 409)
    }

    getTeamCardsCount = () => {
        this.remainingWordsCount =  { red: 0, blue: 0, neutral: 0, black: 0 };
        if(this.cards.length)
            this.cards
            .filter((card : Word) => !card.isClicked)
            .forEach((card : Word) => this.remainingWordsCount[card.teamName]++);
    }

    checkTeam(team: User[]){
        return team.length >= 2 && team.length <= 10 && team.some(user => user.role === "captain");
    }
}

export default GameController;