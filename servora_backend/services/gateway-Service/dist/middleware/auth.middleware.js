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
const loginValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer ")) ? req.headers.authorization.split(" ")[1] : req.cookies.accessToken || ((_b = req.body) === null || _b === void 0 ? void 0 : _b.token);
        // if(!token || !token.startsWith("Bearer ")){
        //     throw new appError("token is missing",400)
        // }
        // const actualToken=token.split(" ")[1]
        const tokenVerify = jsonwebtoken_1.default.verify(token, process.env.SECREAT_KEY);
        req.user = tokenVerify;
        next();
    }
    catch (error) {
        res.status(error.statuCode || 400).json({
            success: false,
            message: error.message || "internal server error"
        });
    }
});
exports.loginValidation = loginValidation;
