import users from "../../data/usersData"

export default (userId : string) => {
    const userIndex = users.map(user => user.id).indexOf(userId);
    return users[userIndex];
}