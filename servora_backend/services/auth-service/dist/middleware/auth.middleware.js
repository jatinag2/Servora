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
exports.loginValidation = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../utils/AppError");
const loginValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer ")) {
            throw new AppError_1.AppError("token is missing", 400);
        }
        const actualToken = token.split(" ")[1];
        const secret = process.env.SECREAT_KEY;
        if (!secret) {
            throw new AppError_1.AppError("secret key missing", 500);
        }
        console.log("SIGN SECRET:", secret);
        const tokenVerify = jsonwebtoken_1.default.verify(actualToken, secret);
        req.user = tokenVerify;
        next();
    }
    catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "internal server error"
        });
    }
});
exports.loginValidation = loginValidation;
