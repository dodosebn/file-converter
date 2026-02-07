import { OAuthUser } from '../oauth.types';

export interface OAuthProviderHandler {
  getAuthUrl(): string;
  getUser(code: string): Promise<OAuthUser>;
}
