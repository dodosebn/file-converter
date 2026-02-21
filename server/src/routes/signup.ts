import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { signJwt } from "../auth/jwt";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email ? email.toLowerCase() : "";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
    }
    if (!/(?=.*\d)/.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one number" });
    }

    const forbidden = ["1234", "password", "abcd", "qwerty"];
    if (forbidden.some(seq => password.toLowerCase().includes(seq))) {
      return res.status(400).json({ message: "Password is too common or insecure" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email: normalizedEmail, password: hashed },
    });

    const token = signJwt(user.id);

    const { password: _, ...userSafe } = user;

    res.status(201).json({ token, user: userSafe });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
