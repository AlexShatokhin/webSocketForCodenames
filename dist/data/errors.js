"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["ROOM_ALREADY_EXISTS"] = "room_already_exists";
    ErrorCodes["ROOM_NOT_FOUND"] = "room_not_found";
    ErrorCodes["ROOM_IS_FULL"] = "room_is_full";
    ErrorCodes["USER_NOT_FOUND"] = "user_not_found";
    ErrorCodes["INCORRECT_PASSWORD"] = "incorrect_password";
    ErrorCodes["USER_NOT_IN_TEAM"] = "user_not_in_team";
    ErrorCodes["TOO_FEW_PLAYERS"] = "too_few_players";
    ErrorCodes["RED_TEAM_INCOMPLETE"] = "red_team_incomplete";
    ErrorCodes["BLUE_TEAM_INCOMPLETE"] = "blue_team_incomplete";
    ErrorCodes["GAME_ENDED"] = "game_ended";
    ErrorCodes["USER_OR_ROOM_NOT_FOUND"] = "user_or_room_not_found";
    ErrorCodes["ROOM_SESSION_ENDED"] = "room_session_ended";
    ErrorCodes["TEAM_ALREADY_HAS_CAPTAIN"] = "team_already_has_captain";
})(ErrorCodes || (ErrorCodes = {}));
exports.default = ErrorCodes;
