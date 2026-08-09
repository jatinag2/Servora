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
exports.signUpService = void 0;
const AppError_1 = require("../utils/AppError");
const user_model_1 = require("../models/user.model");
const otp_model_1 = __importDefault(require("../models/otp.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUpService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, role, otp } = data;
    const isRegistered = yield user_model_1.User.findOne({ email });
    if (isRegistered) {
        throw new AppError_1.AppError("user already registered", 404);
    }
    const latestOtp = yield otp_model_1.default.findOne({ email }).sort({ createdAt: -1 });
    if (!latestOtp) {
        throw new AppError_1.AppError("otp expired", 404);
    }
    if (latestOtp.otp != otp) {
        throw new AppError_1.AppError('otp is incorrect', 404);
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 6);
    const newUser = yield user_model_1.User.create({
        fullName,
        password: hashedPassword,
        email,
        role
    });
    const payload = {
        fullName,
        email,
        role,
        userId: newUser._id
    };
    const secreatKey = process.env.SECREAT_KEY;
    if (!secreatKey) {
        throw new AppError_1.AppError("canot find secreat key", 404);
    }
    const token = yield jsonwebtoken_1.default.sign(payload, secreatKey, {
        expiresIn: '1m'
    });
    const userObj = newUser.toObject();
    userObj.token = token;
    userObj.password = undefined;
    return userObj;
});
exports.signUpService = signUpService;
