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
exports.updatePasswordController = exports.resetPasswordController = exports.verfiyForgotPasswordOtpController = exports.forgotPasswordController = exports.loginController = exports.signUpController = exports.sendEmailController = void 0;
const AppError_1 = require("../utils/AppError");
const otp_service_1 = require("../services/otp.service");
const auth_service_1 = require("../services/auth.service");
const password_service_1 = require("../services/password.service");
const redis_config_1 = require("../config/redis.config");
const sendEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, role, confirmPassword } = req.body;
    try {
        if (!fullName || !email || !password || !role || !confirmPassword) {
            throw new AppError_1.AppError("please provide all credentials ", 400);
        }
        if (password.length < 8) {
            throw new AppError_1.AppError("at least 8 length password is required", 422);
        }
        if (confirmPassword != password) {
            throw new AppError_1.AppError("confirm password and password are not equal", 422);
        }
        //service call
        const newOtp = yield (0, otp_service_1.sendOtpService)({ fullName, email, password, role });
        console.log('hello');
        res.status(201).json({
            message: "otp created successfully",
            success: true,
            data: newOtp
        });
    }
    catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "internal server error"
        });
    }
});
exports.sendEmailController = sendEmailController;
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, role, otp } = req.body;
        const userInfo = yield (0, auth_service_1.signUpService)({ fullName, email, password, role, otp });
        res.cookie("refreshToken", userInfo.refreshToken, {
            httpOnly: true,
            // secure:false ,//true in production with HTTTPS
            // sameSite:"strict",
            maxAge: 3 * 24 * 60 * 60 * 1000
        });
        res.status(201).json({
            message: "user created successfully",
            success: true,
            data: userInfo.userObj
        });
    }
    catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "internal server error"
        });
    }
});
exports.signUpController = signUpController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new AppError_1.AppError("email and password required for login", 400);
        }
        const client = (0, redis_config_1.getRedisClient)();
        const clientIpAddress = req.ip;
        const key = `${clientIpAddress}:req_count`;
        const requestCount = yield client.incr(key);
        if (requestCount == 1) {
            yield client.expire(key, 60);
        }
        if (requestCount > 10) {
            throw new AppError_1.AppError("cannot hit more than 10req within 1 minute", 400);
        }
        const logindata = yield (0, auth_service_1.loginService)({ email, password });
        res.cookie("refreshToken", logindata.refreshToken, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000
        }).status(201).json({
            message: "user login successfully successfully",
            success: true,
            data: logindata.userObj
        });
    }
    catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "internal server error"
        });
    }
});
exports.loginController = loginController;
const forgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('fpc');
        const { email } = req.body;
        if (!email) {
            throw new AppError_1.AppError("email is required", 400);
        }
        const forgotPasswordData = yield (0, password_service_1.forgotPasswordService)({ email });
        res.status(201).json({
            message: "otp send successfully forforgot password",
            success: true
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "internal server error"
        });
    }
});
exports.forgotPasswordController = forgotPasswordController;
const verfiyForgotPasswordOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            throw new AppError_1.AppError("email is required", 400);
        }
        const updatedUserWithToken = yield (0, password_service_1.verifyForgotPasswordOtpService)({ email, otp });
        res.status(201).json({
            success: true,
            message: "otp verify successfully for forgot password",
            data: updatedUserWithToken
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "internal server error"
        });
    }
});
exports.verfiyForgotPasswordOtpController = verfiyForgotPasswordOtpController;
const resetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password, confirmPassword } = req.body;
        if (!password || !confirmPassword) {
            throw new AppError_1.AppError("plese fiil all input ", 400);
        }
        if (!token) {
            throw new AppError_1.AppError("wrong during fecthing token", 400);
        }
        const resetPasswordDetail = yield (0, password_service_1.resetPasswordService)({ password, confirmPassword, token });
        res.status(201).json({
            success: true,
            message: "password reset successfully"
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "internal server error"
        });
    }
});
exports.resetPasswordController = resetPasswordController;
const updatePasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, oldPassword, newPassword, confirmPassword } = req.body;
        if (!userId || !oldPassword || !newPassword || !confirmPassword) {
            throw new AppError_1.AppError("details are required", 400);
        }
        if (newPassword != confirmPassword) {
            throw new AppError_1.AppError("confirm password not match with newpassword", 400);
        }
        if (newPassword == oldPassword) {
            throw new AppError_1.AppError("old password  matches with newpassword", 400);
        }
        const updatePasswordDetail = yield (0, password_service_1.updatePasswordService)({ userId, oldPassword, newPassword });
        res.status(200).json({
            success: true,
            message: "password update successfully",
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "internal server error"
        });
    }
});
exports.updatePasswordController = updatePasswordController;
