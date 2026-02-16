// src/auth/oauth.service.ts
import { OAuthUser } from './oauth.types'
import { prisma } from "../lib/prisma";


export async function findOrCreateOAuthUser(oauthUser: OAuthUser) {
  const { provider, providerId, email, name } = oauthUser

  let user = await prisma.user.findFirst({
    where:
      provider === 'google'
        ? { googleId: providerId }
        : { githubId: providerId },
  })

  if (!user && email) {
    user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data:
          provider === 'google'
            ? { googleId: providerId }
            : { githubId: providerId },
      })
    }
  }

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
