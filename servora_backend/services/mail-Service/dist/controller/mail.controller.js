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
exports.sendMail = void 0;
const appError_1 = require("../utils/appError");
const mail_services_1 = require("../services/mail.services");
const sendMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const { email, subject, body, from } = req.body;
        console.log(email);
        if (!email || !subject || !body || !from) {
            throw new appError_1.AppError(`data is incomplete for mail transfer`, 400);
        }
        const sendMail = yield (0, mail_services_1.sendEmailService)({ email, subject, body, from });
        console.log('mail controller');
        res.status(200).json({
            success: true,
            message: "otp send successfully"
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
});
exports.sendMail = sendMail;
