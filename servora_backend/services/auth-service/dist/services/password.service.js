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
exports.updatePasswordService = exports.resetPasswordService = exports.verifyForgotPasswordOtpService = exports.forgotPasswordService = void 0;
const user_model_1 = require("../models/user.model");
const AppError_1 = require("../utils/AppError");
const otp_generator_1 = __importDefault(require("otp-generator"));
const axios_1 = __importDefault(require("axios"));
const sendEmail_templates_1 = require("../templates/sendEmail.templates");
const node_crypto_1 = __importDefault(require("node:crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const redis_config_1 = require("../config/redis.config");
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
    //save otp in mongoDB
    //  const newSavedOtp=await Otp.create({
    //   otp:newOtp,
    //   email:email
    //  })
    //save otp in redis
    const redisClient = (0, redis_config_1.getRedisClient)();
    const newSavedOtp = yield redisClient.set(`forgot_password_otp:${email}`, newOtp, {
        EX: 300
    });
    const mailData = {
        from: process.env.SENDER_EMAIL,
        email: email,
        subject: "forgot password verfication otp",
        body: (0, sendEmail_templates_1.sendEmailTemplate)(Number(newOtp))
    };
    const mailServiceCall = yield axios_1.default.post("http://localhost:3002/api/v1/mail/send-mail", mailData);
    //  return  newSavedOtp
});
exports.forgotPasswordService = forgotPasswordService;
const verifyForgotPasswordOtpService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = data;
    //if forgot password otp in mongoDB atlas 
    //  const otpInDB= await Otp.findOne({email}).sort({createdAt:-1})
    // if(!otpInDB){
    //    throw new AppError("otp  is expired",400)
    //  }
    //  if(otpInDB.otp!= otp){
    //    throw new AppError("otp is wrong",422)
    //  }
    //forgot Password otp on redis
    const redisClient = (0, redis_config_1.getRedisClient)();
    const otpInRedis = yield redisClient.get(`forgot_password_otp:${email}`);
    if (!otpInRedis) {
        throw new AppError_1.AppError("otp  is expired", 400);
    }
    if (otpInRedis != otp) {
        throw new AppError_1.AppError("otp is wrong", 422);
    }
    //generate token
    const token = node_crypto_1.default.randomBytes(32).toString("hex");
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ email }, {
        resetToken: token,
        resetTokenExpiry: Date.now() + 10 * 60 * 1000
    }, { new: true }).select("-password");
    return updatedUser;
});
exports.verifyForgotPasswordOtpService = verifyForgotPasswordOtpService;
const resetPasswordService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password, confirmPassword } = data;
    if (password != confirmPassword) {
        throw new AppError_1.AppError("password and confirmPassword not equal ", 400);
    }
    if (password.length < 8) {
        throw new AppError_1.AppError("minimum 8 length password required ", 400);
    }
    const userinDB = yield user_model_1.User.findOne({ resetToken: token });
    if (!userinDB) {
        throw new AppError_1.AppError("session expired ", 400);
    }
    if (userinDB.resetTokenExpiry < String(Date.now())) {
        throw new AppError_1.AppError("session expired ", 400);
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ resetToken: token }, {
        password: hashedPassword,
        resetToken: "",
        resetTokenExpiry: ""
    }, { new: true });
    return updatedUser;
});
exports.resetPasswordService = resetPasswordService;
const updatePasswordService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, oldPassword, newPassword } = data;
    const userInDB = yield user_model_1.User.findOne({ _id: userId });
    if (!userInDB) {
        throw new AppError_1.AppError('user does not exist', 400);
    }
    const checkPassword = yield bcrypt_1.default.compare(oldPassword, userInDB.password);
    if (!checkPassword) {
        throw new AppError_1.AppError('incorrect old password', 400);
    }
    const newHashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ _id: userId }, {
        password: newHashedPassword
    }, { new: true });
    const mailData = {
        from: process.env.SENDER_EMAIL,
        email: userInDB.email,
        subject: "password update successfully",
        body: (0, sendEmail_templates_1.sendEmailUpdatePasswordTemplate)()
    };
    const mailAfterPasswordUpdate = yield axios_1.default.post(`http://localhost:3002/api/v1/mail/send-mail`, mailData);
    return updatedUser;
});
exports.updatePasswordService = updatePasswordService;
