import { Socket } from "socket.io";
class Error {
    private timestamp: number = Date.now();
    constructor(private socket : Socket, private message: string, private code: number){
        this.socket.emit("error", this.getError());
    }

    getError = () => ({
        message: this.message,
        code: this.code,
        timestamp: this.timestamp
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
*/