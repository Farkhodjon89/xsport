import withSession from '../../../../utils/cookieSession'
import client from "../../../../apollo/apollo-client";
import { formatOrder } from "../../../../utils";
import { CUSTOMER_ORDER } from "../../../../queries/customer";
import { checkCookie } from "../../../../utils/checkCookie";

export default withSession(async (req, res) => {
  const userData = await checkCookie(req.session.get("user"), req);
  const { orderId } = req.body;

  if (!userData.isLoggedIn) {
    res.json({ status: false });

    return;
  }

  const response = await client.query({
    query: CUSTOMER_ORDER,
    fetchPolicy: "no-cache",
    variables: {
      orderId
    }
  });

  res.json({
    status: true,
    order: formatOrder(response.data.order)
  });
})
