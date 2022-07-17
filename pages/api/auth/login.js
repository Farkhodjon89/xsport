import { v4 as uuidV4 } from 'uuid'
import jwt from 'jsonwebtoken'
import withSession from '../../../utils/cookieSession'
import client from '../../../apollo/apollo-client'
import { OTP_AUTH } from '../../../mutations/auth'
import { CUSTOMER } from '../../../queries/customer'

export default withSession(async (req, res) => {
  const { phone, otp, referralCode } = req.body

  try {
    const otpResult = await client.query({
      query: OTP_AUTH,
      fetchPolicy: 'no-cache',
      variables: {
        mutationId: uuidV4(),
        phone,
        referralCode,
        otp,
      },
    })

    const { authToken, refreshToken } = otpResult.data.login
    const decoded = jwt.decode(authToken)

    const userResult = await client.query({
      query: CUSTOMER,
      fetchPolicy: 'no-cache',
      variables: {
        customerId: parseInt(decoded.data.user.id),
      },
    })

    const userData = {
      user: userResult.data.customer,
      isLoggedIn: true,
    }

    req.session.set('user', { ...userData, refreshToken, authToken })

    await req.session.save()

    res.json({ status: true, userData })
  } catch (error) {
    const translatedErrorMessages = {
      'GraphQL error: invalid otp': 'Неверный код',
    }

    res.json({
      status: false,
      message: translatedErrorMessages[error.message] || error.message,
    })
  }
})
