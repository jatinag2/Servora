"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    otp: {
        type: String,
        required: [true, "otp is required"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "user email is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60,
    }
});
const Otp = mongoose_1.default.model('Otp', otpSchema);
exports.default = Otp;
