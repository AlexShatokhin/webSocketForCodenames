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
    public cards : Word[] = [];
    public remainingWordsCount : { [key: string]: number } = { red: 0, blue: 0, neutral: 0, black: 0 }

    constructor(private io : Server,
                private socket : Socket){}

    startGame = (roomId : string, words : string) => {
        this.room = getRoomByRoomId(roomId);
        this.room.cardset = JSON.parse(words);

        this.cards = JSON.parse(words);

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

    finishGame = (winnerTeam : string) => {
        if(this.room?.isGameStarted){
            this.room.isGameStarted = false;
            this.io.in(this.room.id).emit("finish-game", winnerTeam);
        }

    }

    clickCardHandler = (word: Word, userId : string) => {
        if(this.room?.isGameStarted){
            this.cards = this.cards.map((card : Word) => {
                if(card.word === word.word){
                    const updatedWord = {...card};
                    updatedWord.isClicked = true;
                    return updatedWord;
                }
                return card;
            })
            this.getTeamCardsCount();
            for(let team in this.remainingWordsCount){
                if(team !== "neutral"){
                    console.log(team, this.remainingWordsCount[team])
                    if(this.remainingWordsCount[team] === 0){
                        this.finishGame(team);
                    }
                }
            }
            
            if(this.room.isGameStarted)
                this.io.in(this.room?.id as string).emit("update-cards", this.cards, this.remainingWordsCount)
    
        } else new Error(this.socket, "Room not found", 404)
    }

    getTeamCardsCount = () => {
        this.remainingWordsCount =  { red: 0, blue: 0, neutral: 0, black: 0 };
        if(this.cards.length)
            this.cards
            .filter((card : Word) => !card.isClicked)
            .forEach((card : Word) => this.remainingWordsCount[card.teamName]++);
    }

    checkTeam(team: User[]){
        return team.length >= 2 && team.some(user => user.role === "captain");
    }
}

export default GameController;