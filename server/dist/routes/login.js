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
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../service/auth");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    { }
    if (!email || !password)
        return res.status(400).send('Missing fields');
    const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
    if (!(user === null || user === void 0 ? void 0 : user.password))
        return res.status(401).send('Invalid Password');
    if (!(user === null || user === void 0 ? void 0 : user.email))
        return res.status(401).send('Invalid Email');
    if (!user)
        return res.status(401).send('Invalid login');
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match)
        return res.status(401).send('Invalid login');
    const token = jsonwebtoken_1.default.sign({ id: user.id }, auth_1.JWT_SECRET);
    res.json({ token, user });
}));
exports.default = router;
