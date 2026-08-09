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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_config_1 = __importDefault(require("./config/db.config"));
const redis_config_1 = require("./config/redis.config");
const port = process.env.PORT;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_config_1.default)();
        yield (0, redis_config_1.redisConnect)();
        app_1.default.listen(port, () => {
            console.log(`auth service is running on port ${port}`);
        });
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
startServer();
