import axios from 'axios';

export const Octo = async (req, res) => {
  if (req.method === 'POST') {
    const { octoBasket, order, host } = req.body;

    let octo = {
      octo_shop_id: 3331,
      octo_secret: 'fa8caab6-0e74-446f-aa10-7af958172900',
      shop_transaction_id: order.id,
      auto_capture: true,
      test: false,
      init_time: order.date_created.replace(/T/, ' '),
      total_sum: order.total,
      currency: 'UZS',
      description: '',
      basket: octoBasket,
      payment_methods: [
        {
          method: 'uzcard',
        },
      ],
      tsp_id: 18,
      return_url: `${host}/order/${order && order.order_key}`,
      notify_url: 'https://thems.uz/cart',
      language: 'ru',
      ttl: 15,
    };

    let response;
    try {
      response = await axios.post('https://secure.octo.uz/prepare_payment', octo);
    } catch (e) {
      res.end(JSON.stringify({ status: false, message: e.message }));
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: true, data: response.data }));
  } else {
    res.setHeader('Allow', ['POST']);
    res.statusCode = 404;
    res.end();
  }
};
