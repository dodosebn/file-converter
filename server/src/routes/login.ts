import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { auth, AuthRequest } from "../middleware/auth";
import { signJwt } from "../auth/jwt";

const router = Router();


router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`); 

    if (!email || !password) {
      console.log("Login failed: Missing fields");
      return res.status(400).send("Missing fields");
    }

   
    const normalizedEmail = email.toLowerCase(); 

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      console.log(`Login failed: User not found for email ${normalizedEmail}`);
      return res.status(401).json({message: "Invalid Email"});
    }
    if (!user.password) {
        console.log(`Login failed: User ${normalizedEmail} has no password (maybe OAuth?)`);
        return res.status(401).json({ message: "Invalid Password" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log(`Login failed: Password mismatch for ${normalizedEmail}`);
      return res.status(401).json({message: "Invalid login"});
    }

    console.log(`Login success for: ${normalizedEmail}`);
    const token = signJwt(user.id);

    const { password: _, ...userSafe } = user;

    res.json({ token, user: userSafe });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({message: "Server error"});
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
