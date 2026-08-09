"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: process.env.HOST_GMAIL,
    port: Number(process.env.HOST_PORT),
    secure: true,
    auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.PASS
    }
});
