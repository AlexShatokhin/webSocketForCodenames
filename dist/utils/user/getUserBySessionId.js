"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersData_1 = __importDefault(require("../../data/usersData"));
exports.default = (sessionId) => {
    const userIndex = usersData_1.default.map(user => user.session).indexOf(sessionId);
    return usersData_1.default[userIndex];
};
