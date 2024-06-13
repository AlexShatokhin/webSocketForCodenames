import users from "../../data/usersData"

export default (userId : number) => {
    const userIndex = users.map(user => user.getUserId().toString()).indexOf(userId.toString());
    return users[userIndex];
}