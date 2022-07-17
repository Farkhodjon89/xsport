import withSession from '../../../utils/cookieSession'
import client from "../../../apollo/apollo-client";
import { CONVERT_POINTS } from "../../../queries/customer";
import { checkCookie } from "../../../utils/checkCookie";

export default withSession(async (req, res) => {
  const userData = await checkCookie(req.session.get("user"), req);
  const { type } = req.body;

  if (!userData.isLoggedIn) {
    res.json({ status: false });

    return;
  }

  const response = await client.query({
    query: CONVERT_POINTS,
    fetchPolicy: "no-cache",
    context: {
      customerToken: userData.authToken,
    },
    variables: {
      type
    }
  });

  let data = response.data.convertPoints;

  res.json({
    status: true,
    data
  });
})
