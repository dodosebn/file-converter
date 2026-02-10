
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { JWT_SECRET } from '../service/auth';

const router = Router();
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  {}
  if (!email || !password) return res.status(400).send('Missing fields');

  const user = await prisma.user.findUnique({ where: { email } });
  if(!user?.password) return res.status(401).send('Invalid Password');
  if(!user?.email) return res.status(401).send('Invalid Email');
  if (!user) return res.status(401).send('Invalid login');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send('Invalid login');

  const token = jwt.sign({ id: user.id }, JWT_SECRET);
  res.json({ token, user });
});
export default router;