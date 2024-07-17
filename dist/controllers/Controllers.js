"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RoomController_1 = __importDefault(require("./RoomController"));
const CardsController_1 = __importDefault(require("./CardsController"));
const UserController_1 = __importDefault(require("./UserController"));
const GameController_1 = __importDefault(require("./GameController"));
const getUserByUserId_1 = __importDefault(require("../utils/user/getUserByUserId"));
class Controllers {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.checkUserSession = (request) => {
            if ((0, getUserByUserId_1.default)(request.sessionID) !== undefined) {
                const user = (0, getUserByUserId_1.default)(request.sessionID);
                this.userRoomController.user = user;
                this.userController.user = user;
                this.gameController.user = user;
                this.socket.emit("get-user-info", user.getUserInfo());
                if (user.room)
                    this.userRoomController.joinRoom(user.room, user.id, 0, () => { });
            }
            else
                this.socket.emit("add-new-user");
        };
        this.userRoomController = new RoomController_1.default(io, socket);
        this.userCardsController = new CardsController_1.default(io);
        this.userController = new UserController_1.default(io, socket);
        this.gameController = new GameController_1.default(io, socket);
    }
}
exports.default = Controllers;
