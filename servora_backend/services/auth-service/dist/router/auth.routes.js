"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authRouter = express_1.default.Router();
// console.log('router')
authRouter.post('/send-mail-auth', auth_controller_1.sendEmailController);
authRouter.post('/signUp', auth_controller_1.signUpController);
authRouter.post('/forgot-password', auth_controller_1.forgotPasswordController);
authRouter.post('/login', auth_controller_1.loginController);
authRouter.post('/forgot-password-verify-otp', auth_controller_1.verfiyForgotPasswordOtpController);
authRouter.post('/reset-password', auth_controller_1.resetPasswordController);
authRouter.post('/update-password', auth_middleware_1.loginValidation, auth_controller_1.updatePasswordController);
exports.default = authRouter;
