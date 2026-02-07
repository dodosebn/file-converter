import { Request, Response } from 'express';
import { getOAuthProvider } from './oauth.utils';

export const startOAuth = (req: Request, res: Response) => {
  const { provider } = req.params;
  const oauthProvider = getOAuthProvider(Array.isArray(provider) ? provider[0] : provider);

  const url = oauthProvider.getAuthUrl();
  res.json({ url });
};

export const oauthCallback = async (req: Request, res: Response) => {
  const { provider } = req.params;
  const code = req.query.code as string;

  try {
    const oauthProvider = getOAuthProvider(Array.isArray(provider) ? provider[0] : provider);
    const user = await oauthProvider.getUser(code);

    // 🔥 THIS IS WHERE YOU:
    // - find user by provider+providerId
    // - or link accounts
    // - or create user
    console.log('OAuth user:', user);

    res.redirect('http://localhost:5173/in/home');
  } catch (err) {
    console.error(err);
    res.redirect('http://localhost:5173/login?error=oauth_failed');
  }
};
