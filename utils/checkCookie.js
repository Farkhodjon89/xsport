import jwt from 'jsonwebtoken'
import { v4 as uuidV4 } from 'uuid'
import client from '../apollo/apollo-client'
import { REFRESH_TOKEN } from '../mutations/auth'

// We need to check the cookie before to use it
// check required bcz there can be the case when
// auth token is expired
export const checkCookie = async (userData, request) => {
  if (userData == null || !userData.isLoggedIn) {
    return { isLoggedIn: false }
  }

  const { exp } = jwt.decode(userData.authToken)

  if (Date.now() / 1000 >= exp) {
    let refreshResult

    try {
      refreshResult = await client.query({
        query: REFRESH_TOKEN,
        fetchPolicy: 'no-cache',
        variables: {
          mutationId: uuidV4(),
          token: userData.refreshToken
        }
      })
    } catch (e) {
      request.session.set('user', { isLoggedIn: false })
      await request.session.save()

      return { isLoggedIn: false }
    }

    const { authToken } = refreshResult.data.refreshJwtAuthToken

    request.session.set('user', { ...userData, authToken })
    await request.session.save()

    return { ...userData, authToken }
  }

  return userData
}
