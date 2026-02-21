"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const signup_1 = __importDefault(require("./routes/signup"));
const login_1 = __importDefault(require("./routes/login"));
const files_1 = __importDefault(require("./routes/files"));
const oauth_routes_1 = __importDefault(require("./auth/oauth.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/auth", login_1.default);
app.use("/auth", signup_1.default);
app.use("/auth/oauth", oauth_routes_1.default);
app.use("/files", files_1.default);
const path_1 = __importDefault(require("path"));
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
exports.default = app;
