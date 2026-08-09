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
exports.verifyForgotPasswordOtpService = exports.forgotPasswordService = void 0;
const user_model_1 = require("../models/user.model");
const AppError_1 = require("../utils/AppError");
const otp_generator_1 = __importDefault(require("otp-generator"));
const otp_model_1 = __importDefault(require("../models/otp.model"));
const axios_1 = __importDefault(require("axios"));
const sendEmail_templates_1 = require("../templates/sendEmail.templates");
const node_crypto_1 = __importDefault(require("node:crypto"));
const forgotPasswordService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = data;
    const existUser = yield user_model_1.User.findOne({ email });
    if (!existUser) {
        throw new AppError_1.AppError("user with email does not exist", 400);
    }
    const newOtp = otp_generator_1.default.generate(6, {
        specialChars: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false
    });
    const newSavedOtp = yield otp_model_1.default.create({
        otp: newOtp,
        email: email
    });
    const mailData = {
        from: process.env.SENDER_EMAIL,
        email: email,
        subject: "forgot password verfication otp",
        body: (0, sendEmail_templates_1.sendEmailTemplate)(Number(newOtp))
    };
    const mailServiceCall = yield axios_1.default.post("http://localhost:3002/api/v1/mail/send-mail", mailData);
    return newSavedOtp;
});
exports.forgotPasswordService = forgotPasswordService;
const verifyForgotPasswordOtpService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = data;
    const otpInDB = yield otp_model_1.default.findOne({ email }).sort({ createdAt: -1 });
    if (!otpInDB) {
        throw new AppError_1.AppError("otp  is expired", 400);
    }
    if (otpInDB.otp != otp) {
        throw new AppError_1.AppError("otp is wrong", 422);
    }
    //genertae token
    const token = node_crypto_1.default.randomBytes(32).toString("hex");
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ email }, {
        resetToken: token,
        resetTokenExpiry: Date.now() + 10 * 60 * 1000
    }, { new: true }).select("-password");
    return updatedUser;
});
exports.verifyForgotPasswordOtpService = verifyForgotPasswordOtpService;
