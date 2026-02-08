import { OAuthUser } from './oauth.types'
import { prisma } from "../lib/prisma";


export async function findOrCreateOAuthUser(oauthUser: OAuthUser) {
  const { provider, providerId, email, name } = oauthUser

  // 1. Try provider ID first
  let user = await prisma.user.findFirst({
    where:
      provider === 'google'
        ? { googleId: providerId }
        : { githubId: providerId },
  })

  // 2. If not found, try email (account linking)
  if (!user && email) {
    user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      // Link provider to existing account
      user = await prisma.user.update({
        where: { id: user.id },
        data:
          provider === 'google'
            ? { googleId: providerId }
            : { githubId: providerId },
      })
    }
  }

  // 3. Still no user → create new one
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        googleId: provider === 'google' ? providerId : undefined,
        githubId: provider === 'github' ? providerId : undefined,
      },
    })
  }

  return user
}
