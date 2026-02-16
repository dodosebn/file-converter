// src/auth/oauth.types.ts
export type OAuthProvider = 'google' | 'github';

export interface OAuthUser {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  name: string;
  avatar?: string;
}
