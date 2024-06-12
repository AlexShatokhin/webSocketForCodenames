# Проект websockets

Этот проект представляет собой сервер WebSocket, построенный с использованием Node.js и TypeScript. Следуйте инструкциям ниже, чтобы настроить проект, установить зависимости и запустить сервер.

## Предварительные требования

Убедитесь, что у вас установлены следующие программы:

- [Node.js](https://nodejs.org/) (версия 14.x или новее)
- [npm](https://www.npmjs.com/) (версия 6.x или новее)

## Начало работы

### 1. Клонирование репозитория

Клонируйте репозиторий на ваш локальный компьютер с помощью Git:

```bash
git clone https://github.com/your-username/websockets.git
cd websockets
```

### 2. Установка зависимостей

Установите необходимые зависимости, выполнив команду:

```bash
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корневой директории проекта и добавьте необходимые переменные окружения. Например:

```env
PORT=3000
```

Замените значения на вашу актуальную конфигурацию.

### 4. Запуск сервера

Запустите сервер с использованием `nodemon`:

```bash
npm start
```

Это запустит сервер и автоматически перезапустит его при любых изменениях в исходных файлах.

### 5. Проверка работы сервера

Откройте браузер или инструмент вроде Postman и перейдите по адресу `http://localhost:3000` (или на порт, указанный вами в файле `.env`), чтобы убедиться, что сервер работает.


## Вклад в проект

Если вы хотите внести вклад в этот проект, выполните следующие шаги:

1. Форкните репозиторий.
2. Создайте новую ветку (`git checkout -b feature-branch`).
3. Внесите ваши изменения.
4. Зафиксируйте ваши изменения (`git commit -m 'Добавить новую функцию'`).
5. Отправьте ветку на удаленный репозиторий (`git push origin feature-branch`).
6. Создайте новый Pull Request.

---

Если у вас есть вопросы или проблемы, пожалуйста, откройте issue в репозитории.

Удачного кодирования!