"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, http_proxy_middleware_1.createProxyMiddleware)({ target: "http://localhost:3001", changeOrigin: true, pathFilter: "/api/v1/auth" }));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("gateway service running on port ", port);
});
