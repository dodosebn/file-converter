// src/auth/providers/google.provider.ts
import { OAuth2Client } from 'google-auth-library';
import { OAuthProviderHandler } from './index';
import { OAuthUser } from '../oauth.types';

const redirectUri = 'http://localhost:3000/auth/callback/google';

export class GoogleProvider implements OAuthProviderHandler {
  private client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  getAuthUrl(): string {
    return this.client.generateAuthUrl({
      scope: ['profile', 'email'],
      prompt: 'consent',
    });
  }

  async getUser(code: string): Promise<OAuthUser> {
    const { tokens } = await this.client.getToken(code);
    this.client.setCredentials(tokens);

    const res = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`
    );
    const data = await res.json();

    return {
      provider: 'google',
      providerId: data.sub,
      email: data.email,
      name: data.name,
      avatar: data.picture,
    };
  }
}
