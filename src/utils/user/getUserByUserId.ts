import users from "../../data/usersData"

export default (userId : number) => {
    return users.map(user => user.getUserId().toString()).indexOf(userId.toString());
}