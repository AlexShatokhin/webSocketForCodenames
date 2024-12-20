import { Server, Socket } from "socket.io";
import Room from "../classes/Room";
import User from "../classes/User";
import Error from "../classes/Error";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import { Word } from "../types/Word";
import getWordSet from "../utils/words/getWordSet";
import { teamType } from "../types/teamType";
import getUserByUserId from "../utils/user/getUserByUserId";
import { changeRooms, setRooms } from "../data/roomsData";
import { Request } from "express";

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

    finishGame = (room : Room, winnerTeam : string) => {
        if(room.isGameStarted){
            room.isGameStarted = false;
            this.io.in(room.id).emit("finish-game", winnerTeam);
        }
    }

    clickCardHandler = (word: string) => {
        const request = this.socket.request as Request;
        const userId = request.sessionID;
        const senderUser = getUserByUserId(userId);
        const updatedRoom = getRoomByRoomId(senderUser.room as string);

        if(updatedRoom?.isGameStarted){
            updatedRoom.cardset = updatedRoom.cardset.map((card : Word) => {
                if(card.word === word){
                    const updatedWord = {...card};
                    updatedWord.isClicked = true;
                    return updatedWord;
                }
                return card;
            })
            const remainingWordsCount : {[team: string] : number} = this.getTeamCardsCount(updatedRoom.cardset);
           console.log(remainingWordsCount)
            for(let team in remainingWordsCount){
                if(team !== "neutral"){
                    if(remainingWordsCount[team] === 0){
                        if(team === "black") 
                            this.finishGame(updatedRoom, senderUser.team === "red" ? "blue" : "red")
                        else
                            this.finishGame(updatedRoom, team);
                    }
                }
            }
            
            changeRooms(updatedRoom);
            this.io.in(updatedRoom?.id as string).emit("update-room", updatedRoom.getRoomInfo())
    
        } else new Error(this.socket, "Game was ended", 409)
    }

    getTeamCardsCount = (cards : Word[]) => {
        console.log(cards);
        const remainingWordsCount =  { red: 0, blue: 0, neutral: 0, black: 0 };
        if(cards.length)
            cards
            .filter((card : Word) => !card.isClicked)
            .forEach((card : Word) => remainingWordsCount[card.teamName]++);
        return remainingWordsCount;
    }

    checkTeam(team: User[]){
        return team.length >= 2 && team.length <= 10 && team.some(user => user.role === "captain");
    }
}

export default GameController;