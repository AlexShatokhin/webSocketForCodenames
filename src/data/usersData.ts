import User from "../classes/User";

const users : User[] = [];
export const editUser = (user: User) => {
    const index = users.findIndex(u => u.id === user.id);
    users[index] = user;
}
export default users; 
