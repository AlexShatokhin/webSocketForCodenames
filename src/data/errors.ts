enum ErrorCodes {
    ROOM_ALREADY_EXISTS = "room_already_exists",
    ROOM_NOT_FOUND = "room_not_found",
    ROOM_IS_FULL = "room_is_full",
    USER_NOT_FOUND = "user_not_found",
    // USER_ALREADY_EXISTS = "user_already_exists",
    INCORRECT_PASSWORD = "incorrect_password",
    USER_NOT_IN_TEAM = "user_not_in_team",
    TOO_FEW_PLAYERS = "too_few_players",
    RED_TEAM_INCOMPLETE = "red_team_incomplete",
    BLUE_TEAM_INCOMPLETE = "blue_team_incomplete",
    GAME_ENDED = "game_ended",
    USER_OR_ROOM_NOT_FOUND = "user_or_room_not_found",
    ROOM_SESSION_ENDED = "room_session_ended",
    TEAM_ALREADY_HAS_CAPTAIN = "team_already_has_captain",
}

export default ErrorCodes;