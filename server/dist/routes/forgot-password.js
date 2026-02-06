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
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../lib/prisma");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
router.post("/forgot-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).send("Email is required");
        const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.json({
                message: "If this email exists, reset instructions have been sent",
            });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const hashedToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
        yield prisma_1.prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: new Date(Date.now() + 1000 * 60 * 15),
            },
        });
        const resetURL = `${FRONTEND_URL}/reset-password/${resetToken}`;
        yield transporter.sendMail({
            from: `"FastConvert Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset your FastConvert password",
            html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to set a new password (expires in 15 minutes):</p>
        <a href="${resetURL}" target="_blank">${resetURL}</a>
      `,
        });
        res.json({
            message: "If this email exists, reset instructions have been sent",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}));
exports.default = router;
