import { Router, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import dotenv from "dotenv";
 const router = Router();
 dotenv.config();
 async function getUserData(access_token: any){
const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${access_token}`);
const data = await response.json();
console.log('data', data);
 }
router.get('/callback/google', async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const redirectUrl = 'http://localhost:3000/auth/callback/google';
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl
    );

    const tokenResponse = await client.getToken(code);
    client.setCredentials(tokenResponse.tokens);

    const user = tokenResponse.tokens;
    await getUserData(user.access_token);

    res.redirect(`${process.env.FRONTEND_URL}/in/home`);
  } catch (err) {
    console.error('Google OAuth error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});

export default router;