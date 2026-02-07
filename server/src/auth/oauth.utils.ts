import { GoogleProvider } from './providers/google.provider';
import { GithubProvider } from './providers/github.provider';

export function getOAuthProvider(provider: string) {
  switch (provider) {
    case 'google':
      return new GoogleProvider();
    case 'github':
      return new GithubProvider();
    default:
      throw new Error('Unsupported OAuth provider');
  }
}
