import withSession from '../../../utils/cookieSession'

export default withSession(async (req, res) => {
  req.session.destroy();
  res.json({ status: true, userData: { isLoggedIn: false } });
})
