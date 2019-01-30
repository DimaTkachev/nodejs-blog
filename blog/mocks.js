const faker = require('faker');
const TurndownService = require('turndown')();
const slugify = require('slugify');

const models = require('./models');

const owner = '5c34d89e005f740e785cca3d';

module.exports = async () => {
  try {
    await models.Post.remove();

    Array.from({ length: 20 }).forEach(async () => {
      const title = faker.lorem.words(5);
      const post = await models.Post.create({
        title,
        body: TurndownService.turndown(faker.lorem.words(100)),
        url: slugify(title, {
          lower: true,
          remove: /[*+~.()'"!:@,ь]/g
        }),
        owner
      });
      console.log(post);
    });
  } catch (error) {
    console.log(error);
  }
};
