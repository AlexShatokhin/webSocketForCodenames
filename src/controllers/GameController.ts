import { Server, Socket } from "socket.io";
import Room from "../classes/Room";
import User from "../classes/User";
import Error from "../classes/Error";
import getRoomByRoomId from "../utils/room/getRoomByRoomId";
import { Word } from "../types/Word";
import getWordSet from "../utils/words/getWordSet";
import getUserByUserId from "../utils/user/getUserByUserId";
import { changeRooms } from "../data/roomsData";
import { Request } from "express";
import getConvertedRooms from "../utils/room/getConvertedRooms";

import errors from "../data/errors";

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

        if(usersLimit && redTeamCheck && blueTeamCheck){
            this.room.isGameStarted = true;
            changeRooms(this.room);
            this.io.in("main").emit("get-rooms", getConvertedRooms());
            this.room.users.forEach(user => console.log(user));
            this.io.in(this.room.id).emit("game-started")
            this.io.in(this.room.id).emit("update-room", this.room.getRoomInfo());
            this.room.updateRoomLifeCycle();
        }
        else {
            if(!usersLimit){
                new Error(this.socket, errors.TOO_FEW_PLAYERS);
                return;
            }
            if(!redTeamCheck)
                new Error(this.socket, errors.RED_TEAM_INCOMPLETE);
            if(!blueTeamCheck)
                new Error(this.socket, errors.BLUE_TEAM_INCOMPLETE);
        }    
    }

    finishGame = (roomID : string, winnerTeam : string) => {
        const updatedRoom = getRoomByRoomId(roomID);

        if(updatedRoom.isGameStarted){
            updatedRoom.isGameStarted = false;
            updatedRoom.isGameFinished = true;
            changeRooms(updatedRoom);
            this.io.in("main").in(updatedRoom.id).emit("get-rooms", getConvertedRooms());
            this.io.in(updatedRoom.id).emit("finish-game", winnerTeam);
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
                            this.finishGame(updatedRoom.id, senderUser.team === "red" ? "blue" : "red")
                        else
                            this.finishGame(updatedRoom.id, team);
                    }
                }
            }
            
            changeRooms(updatedRoom);
            this.io.in(updatedRoom?.id as string).emit("update-room", updatedRoom.getRoomInfo())
    
        } else new Error(this.socket, errors.GAME_ENDED)
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