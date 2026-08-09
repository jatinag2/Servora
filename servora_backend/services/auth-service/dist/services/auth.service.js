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
exports.loginService = exports.signUpService = void 0;
const AppError_1 = require("../utils/AppError");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_config_1 = require("../config/redis.config");
const signUpService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, role, otp } = data;
    const isRegistered = yield user_model_1.User.findOne({ email });
    if (isRegistered) {
        throw new AppError_1.AppError("user already registered", 404);
    }
    //if otp store in mongodb
    //   const latestOtp=await Otp.findOne({email}).sort({createdAt:-1})
    //redis client
    const redisClient = (0, redis_config_1.getRedisClient)();
    const latestOtp = yield redisClient.get(`redis_client ${email}`);
    if (!latestOtp) {
        throw new AppError_1.AppError("otp expired", 404);
    }
    if (latestOtp != otp) {
        throw new AppError_1.AppError('otp is incorrect', 404);
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
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
    const accessSecreateKey = process.env.ACCESS_TOKEN_SECREAT_KEY;
    if (!accessSecreateKey) {
        throw new AppError_1.AppError("canot find secreat key", 404);
    }
    const accessToken = yield jsonwebtoken_1.default.sign(payload, accessSecreateKey, {
        expiresIn: "15min"
    });
    const refreshTokenPayload = {
        userId: newUser._id
    };
    const refreshSecreateKey = process.env.REFRESH_TOKEN_SECREAT_KEY;
    if (!refreshSecreateKey) {
        throw new AppError_1.AppError("canot find secreat key", 404);
    }
    const refreshToken = yield jsonwebtoken_1.default.sign(refreshTokenPayload, refreshSecreateKey, {
        expiresIn: "7d"
    });
    //save refresh token in redis
    yield redisClient.set(`session:${newUser._id}`, refreshToken, {
        EX: 604800
    });
    const userObj = newUser.toObject();
    userObj.accessToken = accessToken;
    userObj.password = undefined;
    return { userObj, refreshToken };
});
exports.signUpService = signUpService;
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
    const accessSecreateKey = process.env.ACCESS_TOKEN_SECREAT_KEY;
    if (!accessSecreateKey) {
        throw new AppError_1.AppError("canot find secreat key", 404);
    }
    const accessToken = yield jsonwebtoken_1.default.sign(payload, accessSecreateKey, {
        expiresIn: "15min"
    });
    const refreshTokenPayload = {
        userId: existUser._id
    };
    const refreshSecreateKey = process.env.REFRESH_TOKEN_SECREAT_KEY;
    if (!refreshSecreateKey) {
        throw new AppError_1.AppError("canot find secreat key", 404);
    }
    const refreshToken = yield jsonwebtoken_1.default.sign(refreshTokenPayload, refreshSecreateKey, {
        expiresIn: "7d"
    });
    //STORE REFRESH TOKEN IN REDIS
    const redisClient = (0, redis_config_1.getRedisClient)();
    yield redisClient.set(`session:${existUser._id}`, refreshToken, {
        EX: 604800
    });
    const userObj = existUser.toObject();
    userObj.accessToken = accessToken;
    userObj.password = undefined;
    return { userObj, refreshToken };
});
exports.loginService = loginService;
