'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
    }
  }

  Article.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    postedAt: DataTypes.DATE,
    postedBy: DataTypes.STRING,
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      set(value) {
        this.setDataValue('tags', JSON.stringify(value));
      },
      get() {
        const rawValue = this.getDataValue('tags');
        return rawValue ? JSON.parse(rawValue) : null;
      },
    }
  }, {
    sequelize,
    modelName: 'Article',
  });

  return Article;
};
