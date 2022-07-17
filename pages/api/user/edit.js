import { v4 as uuidV4 } from "uuid";

import withSession from '../../../utils/cookieSession'
import client from "../../../apollo/apollo-client";
import { CUSTOMER } from "../../../queries/customer";
import { UPDATE_CUSTOMER } from "../../../mutations/customer";
import { checkCookie } from "../../../utils/checkCookie";

export default withSession(async (req, res) => {
  let userData = await checkCookie(req.session.get("user"), req);

  if (userData == null || !userData.isLoggedIn) {
    return res.json({ isLoggedIn: false })
  }

  const { firstName, lastName, country, city, address, phone } = req.body;

  await client.query({
    query: UPDATE_CUSTOMER,
    fetchPolicy: "no-cache",
    context: {
      customerToken: userData.authToken,
    },
    variables: {
      mutationId: uuidV4(),
      firstName,
      lastName,
      address,
      phone,
      country,
      city,
    }
  });

  const _userResult = await client.query({
    query: CUSTOMER,
    fetchPolicy: "no-cache",
    context: {
      customerToken: userData.authToken,
    },
    variables: {
      customerId: userData.user.databaseId,
    }
  });

  const newUserData = {
    ...userData,
    isLoggedIn: true,
    user: _userResult.data.customer
  };

  await req.session.set("user", userData);

  return res.json(newUserData);
})
