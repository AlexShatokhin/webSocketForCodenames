

# Socket.io Events

## Server side events

### `create-room`

**Description:**
Creating a new room.

**When it works:**
When a client initiates the creation of a new room.

**Received data:**
- `name` (string) — the name of the room to be created.
- `password` (number) — password for the room being created.
- `language` (ru | en | ua) - language of the cards in room
- `callback` (function) - function to return the method status


### `join-room`

**Description:**
Attaching to an existing room.

**When it works:**
When a client tries to join a room.

**Received data:**
- `roomId` (string) — the identifier of the room the client wants to join.
- `password` (number) - room password
- `callback` (function) - function to return the method status


### `leave-room`

**Received data:**
- `callback` (function) - function to return the method status

**Description:**
Exit the room.

**When it works:**
When the client wants to leave the room.

<!-- ### `get-cards`

**Description:**
Getting a list of cards.

**When it works:**
When a client requests a list of cards.

**Received data:**
- `roomId` (string) - room identifier.
- `wordSetType` (ru | en | ua) — dictionary type. -->


### `new-user`

**Description:**
New User Registration.

**When it works:**
When a new user registers.

**Received data:**
- `name` (string) - the name of the new user.

### `change-nmae`

**Description:**
Changing the user name


**Received data:**
- `newName` (string) - the name of the new user.

### `join-team`

**Description:**
Joining a team.

**When it works:**
When a user wants to join a team.

**Received data:**
- `team` (red | blue) — team type.


### `toggle-role`

**Description:**
Getting and switching user roles.

**When it works:**
When a user changes their role.

**Received data:**
- `role` (captain | player) - new user role (optional).


### `start-game`

**Description:**
Start the game.

**When it works:**
When the game starts.


### `card-clicked`
**Description:**
Updating game cards.

**When it works:**
When card clicked

**Received data:**
- `word` (string) — word item. 
