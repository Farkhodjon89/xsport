import WooCommerceResApi from '@woocommerce/woocommerce-rest-api';

import { WP_URL, CONSUMER_KEY, CONSUMER_SECRET } from '../../apollo/wp-config';

const wc = new WooCommerceResApi({
  url: WP_URL,
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
  version: 'wc/v3',
});

export const Transaction = async (req, res) => {
  let response;
  try {
    response = await wc.put(`orders/${req.body.id}`, {
      transaction_id: req.body.transaction_id,
    });
  } catch (e) {
    res.end(JSON.stringify(e));
    return;
  }
  res.end();
};
