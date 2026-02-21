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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const jwt_1 = require("../auth/jwt");
const router = (0, express_1.Router)();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);
        if (!email || !password) {
            console.log("Login failed: Missing fields");
            return res.status(400).send("Missing fields");
        }
        const normalizedEmail = email.toLowerCase();
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            console.log(`Login failed: User not found for email ${normalizedEmail}`);
            return res.status(401).json({ message: "Invalid Email" });
        }
        if (!user.password) {
            console.log(`Login failed: User ${normalizedEmail} has no password (maybe OAuth?)`);
            return res.status(401).json({ message: "Invalid Password" });
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            console.log(`Login failed: Password mismatch for ${normalizedEmail}`);
            return res.status(401).json({ message: "Invalid login" });
        }
        console.log(`Login success for: ${normalizedEmail}`);
        const token = (0, jwt_1.signJwt)(user.id);
        const { password: _ } = user, userSafe = __rest(user, ["password"]);
        res.json({ token, user: userSafe });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
}));
router.get("/me", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user data" });
    }
}));
exports.default = router;
