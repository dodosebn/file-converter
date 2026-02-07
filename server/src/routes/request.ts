import { Router, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import dotenv from "dotenv";
 const router = Router();
 dotenv.config();
 
router.post('/authExternals', async(req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
res.header('Referrer-Policy', 'no-referrer-when-downgrade')
const redirectUrl = 'http://localhost:3000/auth/callback/google';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUrl);
const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    prompt: 'consent'
});
res.json({ url: authUrl });

});
export default router;
