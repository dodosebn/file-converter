import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { auth, AuthRequest } from "../middleware/auth";
import { signJwt } from "../auth/jwt";

const router = Router();

/**
 * LOGIN
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Missing fields");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(401).send("Invalid login");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Invalid login");
    }

    const token = signJwt(user.id);

    const { password: _, ...userSafe } = user;

    res.json({ token, user: userSafe });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


router.get("/me", auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

export default router;
