"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersData_1 = __importDefault(require("../../data/usersData"));
exports.default = (userId) => {
    const userIndex = usersData_1.default.map(user => user.getUserId().toString()).indexOf(userId.toString());
    return usersData_1.default[userIndex];
};
