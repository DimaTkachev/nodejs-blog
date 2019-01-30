const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', async (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const act = req.query.act;
  console.log(act);

  if (!userId || !userLogin) {
    res.redirect('/');
  }

  const userInfo = await models.User.findById(userId);

  res.render('user/user_settings', {
    userInfo,
    act,
    user: {
      id: userId,
      login: userLogin
    }
  });
});

module.exports = router;
