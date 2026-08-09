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
exports.getRedisClient = exports.redisConnect = void 0;
const redis_1 = require("redis");
const AppError_1 = require("../utils/AppError");
class InMemoryRedisMock {
    constructor() {
        this.store = new Map();
        this.expiries = new Map();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Using Mock in-memory Redis client");
            return;
        });
    }
    on(event, callback) {
        return this;
    }
    set(key, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.store.set(key, value);
            if (options === null || options === void 0 ? void 0 : options.EX) {
                this.expiries.set(key, Date.now() + options.EX * 1000);
            }
            else {
                this.expiries.delete(key);
            }
            return 'OK';
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const expiry = this.expiries.get(key);
            if (expiry && Date.now() > expiry) {
                this.store.delete(key);
                this.expiries.delete(key);
                return null;
            }
            return this.store.get(key) || null;
        });
    }
    incr(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const val = yield this.get(key);
            const num = val ? parseInt(val, 10) : 0;
            const nextVal = num + 1;
            yield this.set(key, nextVal.toString());
            return nextVal;
        });
    }
    expire(key, seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            const val = yield this.get(key);
            if (val !== null) {
                this.expiries.set(key, Date.now() + seconds * 1000);
                return 1;
            }
            return 0;
        });
    }
}
let client = null;
const redisConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    let realClient = null;
    try {
        realClient = (0, redis_1.createClient)({
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
                reconnectStrategy: () => false
            }
        });
        realClient.on('error', (err) => {
            if (client === realClient) {
                console.log('Redis Client Error', err);
            }
        });
        yield realClient.connect();
        client = realClient;
        console.log("redis connect successfully");
    }
    catch (error) {
        console.warn("Failed to connect to cloud Redis. Falling back to mock in-memory Redis.");
        if (realClient) {
            try {
                yield realClient.disconnect();
            }
            catch (e) { }
        }
        client = new InMemoryRedisMock();
        yield client.connect();
    }
});
exports.redisConnect = redisConnect;
const getRedisClient = () => {
    if (!client) {
        throw new AppError_1.AppError(" No redis client available", 400);
    }
    return client;
};
exports.getRedisClient = getRedisClient;
