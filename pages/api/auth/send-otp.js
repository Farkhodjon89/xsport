import { v4 as uuidV4 } from "uuid";

import withSession from '../../../utils/cookieSession'
import client from "../../../apollo/apollo-client";
import { LOGIN_SEND_OTP, SIGN_UP_SEND_OTP } from "../../../mutations/auth";

export default withSession(async (req, res) => {
  const { phone, firstName, lastName } = req.body;

  await client.query({
    query: firstName && lastName ? SIGN_UP_SEND_OTP : LOGIN_SEND_OTP,
    fetchPolicy: "no-cache",
    variables: {
      mutationId: uuidV4(),
      phone,
      ...(firstName && lastName ? { firstName, lastName } : {})
    }
  });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ status: true }));
})
