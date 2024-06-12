
module.exports = (roomId, rooms) => {
    return rooms.map(room => room.id).indexOf(roomId);
}