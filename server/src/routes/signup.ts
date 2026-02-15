import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { signJwt } from "../auth/jwt";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("Missing fields");
    }

    if (password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters long");
    }

    if (
      password.includes("1234") ||
      password.includes("password") ||
      password.includes("abcd") ||
      password.includes("qwerty")
    ) {
      return res.status(400).json({
        message: "Password is too common or insecure",
      });
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/.test(password)) {
      return res.status(400).json({
        message:
          "Password must include at least one uppercase letter, one lowercase letter, and one special character",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    const token = signJwt(user.id);

    const { password: _, ...userSafe } = user;

    res.status(201).json({ token, user: userSafe });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
