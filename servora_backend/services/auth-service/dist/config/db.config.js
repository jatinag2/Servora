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
const mongoose_1 = __importDefault(require("mongoose"));
const DBconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoDBURL = process.env.MONGOO_DB_URI;
        if (!mongoDBURL) {
            console.log('mongoDB URL not found');
            process.exit(1);
        }
        const connect = yield mongoose_1.default.connect(mongoDBURL);
        console.log("monogo db connected successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("faliure in connecting monodb connection", error.message);
        }
        else
            console.error("faliure in connecting monodb connection with some unknown error", error);
        process.exit(1);
    }
});
exports.default = DBconnect;
