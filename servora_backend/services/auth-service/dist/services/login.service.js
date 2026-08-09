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
exports.loginService = void 0;
const AppError_1 = require("../utils/AppError");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    const existUser = yield user_model_1.User.findOne({ email });
    if (!existUser) {
        throw new AppError_1.AppError("user does not exist with this email", 400);
    }
    const hashedPassword = existUser.password;
    const ispasswordCorrect = yield bcrypt_1.default.compare(password, hashedPassword);
    if (!ispasswordCorrect) {
        throw new AppError_1.AppError("wrong password", 400);
    }
    const payload = {
        fullName: existUser.fullName,
        email: existUser.email,
        role: existUser.role,
        userId: existUser._id
    };
    const secreatKey = process.env.SECREAT_KEY;
    if (!secreatKey) {
        throw new AppError_1.AppError("canot find secreat key", 404);
    }
    const token = yield jsonwebtoken_1.default.sign(payload, secreatKey, {
        expiresIn: '1m'
    });
    const userObj = existUser.toObject();
    userObj.token = token;
    userObj.password = undefined;
    return userObj;
});
exports.loginService = loginService;
