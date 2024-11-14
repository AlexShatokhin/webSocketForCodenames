import { Socket } from "socket.io";
class Error {

    constructor(socket : Socket, message: string, code: number){
        const timestamp = new Date().getTime();
        socket.emit("error", this.getError(message, code, timestamp));
    }

    getError = (message: string, code : number, timestamp: number) => ({
        message: message,
        code: code,
        timestamp: timestamp
    })
}

export default Error;

/*
Пользователь не найден
Код: 404 Not Found
Описание: Пользователь с указанным идентификатором не был найден в системе.

Пользователь не состоит в команде
Код: 403 Forbidden
Описание: Пользователь не имеет доступа к запрашиваемому ресурсу, так как не является членом команды.

У команды уже есть капитан
Код: 409 Conflict
Описание: Конфликтное состояние, так как у команды уже назначен капитан.

Пароль неверный
Код: 401 Unauthorized
Описание: Пользователь предоставил неверные учетные данные (неправильный пароль).

Игра не начата
Код: 403 Forbidden
Описание: Доступ к игре запрещен, так как не все проверки соблюдены.

Пользователь или комната не найдены
Код: 404 Not Found
Описание: Указанный пользователь или комната не были найдены в системе.

Комната заполнена
Код: 403 Forbidden
Описание: Доступ к комнате запрещен, так как превышен лимит игроков.
*/