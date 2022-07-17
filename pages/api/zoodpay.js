import axios from 'axios';

export const Zoodpay = async (req, res) => {
  if (req.method === 'POST') {
    const { data } = req.body;
    let response;
    try {
      response = await axios.post('https://sandbox-api.zoodpay.com/v0/transactions', data, {
        auth: {
          username: 'Thems@uZ',
          password: 'rLWA2bQg7yD$9nfq',
        },
      });
    } catch (e) {
      res.end(JSON.stringify(e.response.data));
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
