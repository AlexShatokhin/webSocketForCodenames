import { Socket } from "socket.io";
import users from "../data/usersData";
import User from "../classes/User";

class UserController {
    constructor(public socket: Socket){}

    newUser = (name: string) => {
        const newUser = new User(this.socket, this.socket.id, name)
        users.push(newUser);
        this.socket.emit("get-user", newUser.getUserInfo())
    }

}

export default UserController;