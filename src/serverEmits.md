---

# Socket.io Server Emits

## Server side issues

### `get-rooms`

**Description:**
Getting a list of rooms.

**When it works:**
When the server sends the client a list of all available rooms.

**Return data:**
- `rooms` (array of objects) - an array of data about rooms. Example:
 ```json
 [
 {
 "cardset": null
 "id": "bbb34f55-d31a-4941-8e60-142d4b745897"
 "name": "4233"
 "users": null
 "usersInRoom": "2"
 },
 ]
 ```

### `send-cards`

**Description:**
Sending a list of cards to the client.

**When it works:**
When the server sends a list of cards to the client.

**Return data:**
- `cards` (array of objects) - an array of cards. Example:
 ```json
 [
 "{word: 'BOARD', teamName: 'blue', isClicked: false}"
 "{word: 'KIDNEY', teamName: 'neutral', isClicked: false}"
 "{word: 'NAIL', teamName: 'neutral', isClicked: false}"
 "{word: 'FEATHER', teamName: 'red', isClicked: false}"
 "{word: 'AMPHIBIAN', teamName: 'red', isClicked: false}"
 "{word: 'MARRIAGE', teamName: 'red', isClicked: false}"
 "{word: 'TACT', teamName: 'blue', isClicked: false}"
 "{word: 'DOG', teamName: 'blue', isClicked: false}"
 "{word: 'CAPT', teamName: 'black', isClicked: false}"
 ]
 ```

### `game-started`

**Description:**
Notification about the start of the game.

**When it works:**
When the game is successfully launched.

**Return data:**
No.

### `error`

**Description:**
Sending an error message.

**When it works:**
When an error occurs.

**Return data:**
- `error` (object) - an error object containing a message and error code. Examples:
 ```json
 {
 "message": "Not all users have selected a command or the commands are incomplete",
 "code": 403
 }
 ```
 ```json
 {
 "message": "Password is incorrect",
 "code": 401
 }
 ```
 ```json
 {
 "message": "User or room not found",
 "code": 404
 }
 ```
 ```json
 {
 "message": "User has no team",
 "code": 403
 }
 ```
 ```json
 {
 "message": "Team already has a captain",
 "code": 409
 }
 ```
 ```json
 {
 "message": "User not found",
 "code": 404
 }
 ```

### `update-room`

**Description:**
Update room information.

**When it works:**
When the room information is updated.

**Return data:**
- `roomInfo` (object) - updated information about the room. Example:
 ```json
 {
 "cardset": "[{...}, {...}, {...}, {...}, {...}, {...}, {...}, {...}, {...}]"
 "id": "bbb34f55-d31a-4941-8e60-142d4b745897"
 "name": "4233"
 "users": "[{...}, {...}]"
 "usersInRoom": "2"
 },
 ```

### `leave-from-room`

**Description:**
Notification to leave the room.

**When it works:**
When the user leaves the room.

**Return data:**
No.

### `get-user-info`

**Description:**
Obtaining information about the user.

**When it works:**
When the server sends user information to the client.

**Return data:**
- `userInfo` (object) - information about the user. Example:
 ```json
 {
 "id",
 "name",
 "room",
 "team"
 "role"
 }
 ```

### `toggle-roles`

**Description:**
Switching user roles.

**When it works:**
When user roles are switched.

**Return data:**
No.

---