'use strict';

/** @type {import('sequelize-cli').Migration} */
const articles = require("../posts.json");

module.exports = {
  async up(queryInterface, Sequelize) {
    const articlesWithArrayType = articles.map(article => ({
      ...article,
      tags: article.tags.length ? article.tags : ['no-tags']
    }));

    await queryInterface.bulkInsert('Articles', articlesWithArrayType, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Articles', null, {});
  }
};
