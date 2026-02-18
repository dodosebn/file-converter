import { Request, Response } from 'express'
import { getOAuthProvider } from './oauth.utils'
import { findOrCreateOAuthUser } from './oauth.service'
import { signJwt } from './jwt'

const normalizeParam = (p: string | string[]) =>
  Array.isArray(p) ? p[0] : p

export const startOAuth = (req: Request, res: Response) => {
  const provider = normalizeParam(req.params.provider)
  const oauthProvider = getOAuthProvider(provider)

  res.json({ url: oauthProvider.getAuthUrl() })
}

export const oauthCallback = async (req: Request, res: Response) => {
  const provider = normalizeParam(req.params.provider)
  const code = req.query.code as string

  try {
    const oauthProvider = getOAuthProvider(provider)
    const oauthUser = await oauthProvider.getUser(code)

    const user = await findOrCreateOAuthUser(oauthUser)
    const token = signJwt(user.id)

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.redirect(`${process.env.FRONTEND_URL}/in/home`)
  } catch (err) {
    console.error('OAuth error:', err)
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`)
  }
}
