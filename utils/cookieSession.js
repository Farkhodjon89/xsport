import { withIronSession } from 'next-iron-session'

// add cookies to requests
export default function withSession(handler) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'auth-cookie',
    cookieOptions: {
      secure: false,
      // secure: process.env.NODE_ENV === 'production',
    },
  })
}
