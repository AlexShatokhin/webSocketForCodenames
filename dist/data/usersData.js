"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUser = void 0;
const users = [];
const editUser = (user) => {
    const index = users.findIndex(u => u.id === user.id);
    users[index] = user;
};
exports.editUser = editUser;
exports.default = users;
