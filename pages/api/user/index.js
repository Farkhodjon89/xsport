import withSession from '../../../utils/cookieSession'
import client from "../../../apollo/apollo-client";
import { CUSTOMER } from "../../../queries/customer";
import { checkCookie } from "../../../utils/checkCookie";

export default withSession(async (req, res) => {
  let userData = await checkCookie(req.session.get("user"), req);

  if (!userData.isLoggedIn) {
    return res.json({ isLoggedIn: false });
  }

  const userResult = await client.query({
    query: CUSTOMER,
    fetchPolicy: "no-cache",
    context: {
      customerToken: userData.authToken,
    },
    variables: {
      customerId: userData.user.databaseId
    }
  });

  userData = {
    ...userData,
    user: userResult.data.customer,
    cards: userResult.data.cards
  };

  req.session.set("user", userData);
  await req.session.save();

  delete userData.authToken;
  delete userData.refreshToken;

  return res.json(userData);
})
