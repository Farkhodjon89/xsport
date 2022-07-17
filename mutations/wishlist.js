import gql from 'graphql-tag';

export const SIGN_UP_SEND_OTP = gql`
mutation SignUpSendOtp($mutationId: String!, $phone: String!) {
  loginSendOtp(input: {clientMutationId: $mutationId, phone: $phone}) {
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
mutation OtpAuth($mutationId: String!, $otp: String!, $phone: String!) {
  login(input: {clientMutationId: $mutationId, otp: $otp, phone: $phone}) {
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
