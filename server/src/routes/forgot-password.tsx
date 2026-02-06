import { Router, Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); 
const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send("Email is required");

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({
        message: "If this email exists, reset instructions have been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 1000 * 60 * 15), 
      },
    });

    const resetURL = `${FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
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
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
