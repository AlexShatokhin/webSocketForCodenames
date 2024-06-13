"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersData_1 = __importDefault(require("../data/usersData"));
const User_1 = __importDefault(require("../classes/User"));
class UserController {
    constructor(socket) {
        this.socket = socket;
        this.newUser = (name) => {
            const newUser = new User_1.default(this.socket, this.socket.id, name);
            usersData_1.default.push(newUser);
            this.socket.emit("get-user", newUser.getUserInfo());
        };
    }
}
exports.default = UserController;
