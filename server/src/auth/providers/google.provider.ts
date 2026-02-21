// src/auth/providers/google.provider.ts
import { OAuth2Client } from 'google-auth-library';
import { OAuthProviderHandler } from './index';
import { OAuthUser } from '../oauth.types';



export class GoogleProvider implements OAuthProviderHandler {
  private _client: OAuth2Client | null = null;

  private get client() {
    if (!this._client) {
      const redirectUri = `${process.env.SERVER_URL}/auth/oauth/callback/google`;
      this._client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectUri
      );
    }
    return this._client;
  }

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
