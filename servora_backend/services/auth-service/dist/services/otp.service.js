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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpService = void 0;
const user_model_1 = require("../models/user.model");
const AppError_1 = require("../utils/AppError");
const otp_generator_1 = __importDefault(require("otp-generator"));
const sendEmail_templates_1 = require("../templates/sendEmail.templates");
const axios_1 = __importDefault(require("axios"));
const redis_config_1 = require("../config/redis.config");
const sendOtpService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, fullName, password, role } = data;
        const newUser = yield user_model_1.User.findOne({ email });
        if (newUser) {
            throw new AppError_1.AppError('user with this email exist', 400);
        }
        const newOtp = otp_generator_1.default.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        // saving otp in mongoDB
        // const newSavedOtp=await Otp.create({
        //       email:email,
        //       otp:newOtp
        // })
        // console.log(newSavedOtp)
        //saving otp in redis
        const client = (0, redis_config_1.getRedisClient)();
        const key = `redis_client ${email}`;
        const redisSavedOtp = yield client.set(key, newOtp, {
            EX: 300
        });
        const mailData = {
            email: email,
            subject: `confirming account Verification`,
            body: (0, sendEmail_templates_1.sendEmailTemplate)(Number(newOtp)),
            from: process.env.SENDER_EMAIL
        };
        console.log(mailData);
        const mailServiceCall = yield axios_1.default.post(`http://localhost:3002/api/v1/mail/send-mail`, mailData);
        console.log(mailServiceCall);
    }
    catch (error) {
        console.log("Error in sendOtpService:", error.message);
        throw error;
    }
});
exports.sendOtpService = sendOtpService;
