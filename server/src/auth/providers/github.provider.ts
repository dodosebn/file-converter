// src/auth/providers/github.provider.ts
import { OAuthProviderHandler } from './index';
import { OAuthUser } from '../oauth.types';



export class GithubProvider implements OAuthProviderHandler {
  getAuthUrl(): string {
    const redirectUri = `${process.env.SERVER_URL}/auth/oauth/callback/github`;
    return (
      `https://github.com/login/oauth/authorize` +
      `?client_id=${process.env.GITHUB_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=user:email`
    );
  }

  async getUser(code: string): Promise<OAuthUser> {
    const tokenRes = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const user = await userRes.json();

    const emailRes = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const emails = await emailRes.json();

    const primaryEmail =
      emails.find((e: any) => e.primary)?.email || user.email;

    return {
      provider: 'github',
      providerId: String(user.id),
      email: primaryEmail,
      name: user.name || user.login,
      avatar: user.avatar_url,
    };
  }
}
