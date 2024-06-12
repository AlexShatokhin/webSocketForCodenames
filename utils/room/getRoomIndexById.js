
module.exports = (roomId, rooms) => {
    return rooms.map(room => room.getRoomId()).indexOf(roomId);
}