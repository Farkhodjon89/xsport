import withSession from '../../../utils/cookieSession'
import client from "../../../apollo/apollo-client";
import { WRITE_REVIEW } from "../../../mutations/review";
import { checkCookie } from "../../../utils/checkCookie";
import { v4 as uuidV4 } from "uuid";

export default withSession(async (req, res) => {
  let userData = await checkCookie(req.session.get("user"), req);

  if (userData == null || !userData.isLoggedIn) {
    return res.json({ status: false });
  }

  const reviewData = req.body;

  let reviewResult;

  const karachiDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi", hour12: false });

  const [date, time] = karachiDateTime.split(', ');
  const [year, month, day] = date.split('/');
  const [hours, minutes, seconds] = time.split(':');

  try {
    reviewResult = await client.query({
      query: WRITE_REVIEW,
      fetchPolicy: "no-cache",
      context: {
        customerToken: userData.authToken,
      },
      variables: {
        mutationId: uuidV4(),
        date: `${month}.${day}.${year} ${hours}:${minutes}:${seconds}`,
        ...reviewData
      }
    });
  } catch (e) {
    return res.json({ status: false, message: e.graphQLErrors[0].message });
  }

  return res.json({ status: true, result: reviewResult.data.writeReview.review });
})
