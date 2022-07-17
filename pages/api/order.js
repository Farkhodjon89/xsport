import WooCommerceResApi from '@woocommerce/woocommerce-rest-api';

import {WP_URL, CONSUMER_KEY, CONSUMER_SECRET} from '../../apollo/wp-config';

const wc = new WooCommerceResApi({
  url: WP_URL,
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
  version: 'wc/v3',
});


export default async (req, res) => {
  if (req.method === 'POST') {
    const {order} = req.body;
    let response;


    try {
      response = await wc.post('orders', order);
    } catch (e) {
      res.end(JSON.stringify({status: false, message: e.message}));
      return;
    }
    // console.log(e.response.data)

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({status: true, order: response.data}));
  } else {
    res.setHeader('Allow', ['POST']);
    res.statusCode = 404;
    res.end();
  }
};
