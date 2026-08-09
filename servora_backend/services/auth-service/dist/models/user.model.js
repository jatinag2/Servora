"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: [true, "fullName field is missing"],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, " email field is missing"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "password field is missing"],
    },
    role: {
        type: String,
        enum: ["user", "worker", "admin"]
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiry: {
        type: String
    }
}, {
    timestamps: true
});
exports.User = mongoose_1.default.model("User", UserSchema); // dur to <iuser> all db operation became typesafe
