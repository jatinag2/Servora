"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailService = void 0;
const mail_config_1 = require("../config/mail.config");
const sendEmailService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("mail service start");
    console.log("before sendMail");
    yield mail_config_1.transporter.sendMail({
        from: data.from,
        to: data.email,
        html: data.body,
        subject: data.subject,
    });
    console.log("after sendMail");
});
exports.sendEmailService = sendEmailService;
