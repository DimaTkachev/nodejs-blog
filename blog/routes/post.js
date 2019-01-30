const express = require('express');
const router = express.Router();
const TurndownService = require('turndown')();
const markdownit = require('markdown-it')();
const slugify = require('slugify');

const models = require('../models');

// GET for add
router.get('/add', async (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!userId || !userLogin) {
    res.redirect('/');
  } else {
    try {
      const post = await models.Post.findOne({
        owner: userId,
        status: 'draft'
      });

      console.log(post);

      if (post) {
        res.redirect(`/post/edit/${post.id}`);
      } else {
        const post = await models.Post.create({
          owner: userId,
          status: 'draft'
        });
        res.redirect(`/post/edit/${post.id}`);
      }
    } catch (error) {
      console.log(error);
    }

    // res.render('post/edit', {
    //   user: {
    //     id: userId,
    //     login: userLogin
    //   }
    // });
  }
});

router.get('/edit/:id', async (req, res, next) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const id = req.params.id.trim().replace(/ +(?= )/g, '');

  if (!userId || !userLogin) {
    res.redirect('/');
  } else {
    try {
      const post = await models.Post.findById(id).populate('uploads');

      if (!post) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
      }

      res.render('post/edit', {
        post,
        markdownit,
        user: {
          id: userId,
          login: userLogin
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
});

// POST for add
router.post('/add', async (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!userId || !userLogin) {
    res.redirect('/');
  } else {
    const title = req.body.title.trim().replace(/ +(?= )/g, '');
    const body = req.body.body;
    const isDraft = !!req.body.isDraft;
    const postId = req.body.postId;

    if (!title || !body) {
      const fields = [];

      if (!title) fields.push('title');
      if (!body) fields.push('body');

      res.json({
        ok: false,
        error: 'Все поля должны быть заполнены!',
        fields
      });
    } else if (title.length < 10 || title.length > 64) {
      res.json({
        ok: false,
        error: 'Длина заголовка должна быть от 3 до 64 символов!',
        fields: ['title']
      });
    } else if (body.length < 50) {
      res.json({
        ok: false,
        error: 'Длина поста должна быть не меньше 50 сиволов!',
        fields: ['body']
      });
    } else if (!postId) {
      res.json({
        ok: false
      });
    } else {
      try {
        const post = await models.Post.findOneAndUpdate(
          {
            _id: postId,
            owner: userId
          },
          {
            title,
            body: TurndownService.turndown(body),
            owner: userId,
            status: isDraft ? 'draft' : 'published',
            url: slugify(title, {
              lower: true,
              remove: /[*+~.()'"!:@,ь]/g
            })
          },
          { new: true }
        );

        if (!post) {
          res.json({
            ok: false,
            error: 'Пост не твой!'
          });
        } else {
          res.json({
            ok: true,
            post
          });
        }
      } catch (error) {
        res.json({
          ok: false,
          err: 'Ошибка, попробуйте позже!'
        });
      }
    }
  }
});

module.exports = router;
