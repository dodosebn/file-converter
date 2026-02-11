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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../service/auth");
const router = (0, express_1.Router)();
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).send('Missing fields');
        const existingUser = yield prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (password.length < 6) {
            return res.status(400).send('Password must be at least 6 characters long');
        }
        else if (!name || !email || !password)
            return res.status(400).json({ message: 'Missing fields' });
        if (password.length < 6)
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        if (password.includes("1234") ||
            password.includes("password") ||
            password.includes("abcd") ||
            password.includes("qwerty"))
            return res.status(400).json({ message: 'Password is too common or insecure' });
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/.test(password))
            return res.status(400).json({
                message: 'Password must include at least one uppercase letter, one lowercase letter, and one special character'
            });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        const hashed = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma_1.prisma.user.create({
            data: { name, email, password: hashed },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, auth_1.JWT_SECRET);
        // Security: Don't send the password hash back!
        const { password: _ } = user, userSafe = __rest(user, ["password"]);
        res.status(201).json({ token, user: userSafe });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));
exports.default = router;
