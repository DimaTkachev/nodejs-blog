const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const models = require('../models');

//POST is register
router.post('/register', async (req, res) => {
  const login = req.body.login.replace(/\s/g, '');
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  if (!login || !password || !passwordConfirm) {
    const fields = [];
    if (!login) fields.push('login');
    if (!password) fields.push('password');
    if (!passwordConfirm) fields.push('passwordConfirm');

    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields
    });
  } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
    res.json({
      ok: false,
      error: 'Только латинские буквы и цифры!',
      fields: ['login']
    });
  } else if (login.length < 6 || login.length > 16) {
    res.json({
      ok: false,
      error: 'Длина логина должна быть от 3 до 16 символов!',
      fields: ['login']
    });
  } else if (password !== passwordConfirm) {
    res.json({
      ok: false,
      error: 'Пароли не совпадают!',
      fields: ['password', 'passwordConfirm']
    });
  } else if (password.length < 6) {
    res.json({
      ok: false,
      error: 'Длина пароля должна быть не меньше 6 символов!',
      fields: ['password']
    });
  } else {
    try {
      const user = await models.User.findOne({
        login
      });

      if (!user) {
        bcrypt.hash(password, null, null, async (err, hash) => {
          const user = await models.User.create({
            login,
            password: hash
          });
          console.log(user);
          req.session.userId = user.id;
          req.session.userLogin = user.login;
          res.json({
            ok: true
          });
        });
      } else {
        res.json({
          ok: false,
          error: 'Логин занят другим пользователем!',
          fields: ['login']
        });
      }
    } catch (error) {
      res.json({
        ok: true,
        err: 'Ошибка, попробуйте позже.'
      });
    }
  }
});

//POST is login
router.post('/login', async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  if (!login || !password) {
    const fields = [];
    if (!login) fields.push('login');
    if (!password) fields.push('password');

    res.json({
      ok: false,
      error: 'Заполните пустые поля!',
      fields
    });
  } else {
    try {
      const user = await models.User.findOne({
        login
      });

      if (!user) {
        res.json({
          ok: false,
          error: 'Неверный логин или пароль!',
          fields: ['login', 'password']
        });
      } else {
        bcrypt.compare(password, user.password, function(err, result) {
          if (!result) {
            res.json({
              ok: false,
              error: 'Неверный логин или пароль!',
              fields: ['login', 'password']
            });
          } else {
            req.session.userId = user.id;
            req.session.userLogin = user.login;
            res.json({
              ok: true
            });
          }
        });
      }
    } catch (error) {
      res.json({
        ok: true,
        err: 'Ошибка, попробуйте позже.'
      });
    }
  }
});

// for update a login
router.post('/updatelogin', async (req, res) => {
  const newLogin = req.body.newLogin.replace(/\s/g, '');
  const userId = req.session.userId;
  const fields = ['change-login'];

  console.log(newLogin);

  if (!newLogin) {
    res.json({
      ok: false,
      error: 'Поле должно быть заполнено!',
      fields
    });
  } else if (!/^[a-zA-Z0-9]+$/.test(newLogin)) {
    res.json({
      ok: false,
      error: 'Только латинские буквы и цифры!',
      fields
    });
  } else if (newLogin.length < 6 || newLogin.length > 16) {
    res.json({
      ok: false,
      error: 'Длина логина должна быть от 6 до 16 символов!',
      fields
    });
  } else {
    try {
      const user = await models.User.findOne({
        login: newLogin
      });

      if (!user) {
        const update = await models.User.findOneAndUpdate(
          {
            _id: userId
          },
          {
            login: newLogin
          },
          { new: true }
        );

        if (update) {
          req.session.userLogin = newLogin;

          res.json({
            ok: true,
            access: 'Успешно!',
            fields,
            newLogin
          });
        } else {
          res.json({
            ok: false,
            error: 'Попробуйте позже',
            fields
          });
        }
      } else {
        res.json({
          ok: false,
          error: 'Логин занят другим пользователем!',
          fields
        });
      }
    } catch (error) {
      throw new Error('Попробуйте позже.');
    }
  }
});

router.post('/updatepwd', async (req, res) => {
  const { oldPwd, newPwd, confirmPwd } = req.body;
  const user = await models.User.findById(req.session.userId);

  bcrypt.compare(oldPwd, user.password, function(err, result) {
    if (!result) {
      res.json({
        ok: false,
        error: 'Пароль не изменён, так как прежний пароль введён неправильно.'
      });
    } else {
      if (newPwd === confirmPwd) {
        bcrypt.hash(newPwd, null, null, async (err, hash) => {
          user.password = hash;
          await user.save();
          res.json({
            ok: true,
            access: 'Вы успешно сменили пароль!'
          });
        });
      } else {
        res.json({
          ok: false,
          error: 'Пароль не изменён, так как новый пароль не подтвержден.'
        });
      }
    }
  });
});

// GET for logout
router.get('/logout', (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
