"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mail_router_1 = require("./router/mail.router");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// console.log('mailapp')
app.use('/api/v1/mail', mail_router_1.mailRouter);
exports.default = app;
