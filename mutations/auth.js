import gql from 'graphql-tag';

export const SIGN_UP_SEND_OTP = gql`
mutation SignUpSendOtp($mutationId: String!, $phone: String!, $firstName: String!, $lastName: String!) {
  loginSendOtp(input: {clientMutationId: $mutationId, phone: $phone, firstName: $firstName, lastName: $lastName}) {
    exp
  }
}
`;

export const LOGIN_SEND_OTP = gql`
mutation LoginSendOtp($mutationId: String!, $phone: String!) {
  loginSendOtp(input: {clientMutationId: $mutationId, phone: $phone}) {
    exp
  }
}
`;

export const OTP_AUTH = gql`
mutation OtpAuth($mutationId: String!, $otp: String!, $phone: String!, $referralCode: String) {
  login(input: {clientMutationId: $mutationId, otp: $otp, phone: $phone, referralCode: $referralCode}) {
    authToken
    refreshToken
    sessionToken
  }
}
`;

export const REFRESH_TOKEN = gql`
mutation RefreshAuthToken($mutationId: String!, $token: String!) {
  refreshJwtAuthToken(
    input: {
      clientMutationId: $mutationId,
      jwtRefreshToken: $token,
  }) {
    authToken
  }
}
`;
