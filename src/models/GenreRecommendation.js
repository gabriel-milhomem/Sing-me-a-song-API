const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class GenreRecommendation extends Sequelize.Model { }

const attributes = {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      genreId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      recommendationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
}

const options = {
    sequelize,
    timestamp: false,
    modelName: 'genreRecommendation'
}

GenreRecommendation.init(attributes, options);

module.exports = GenreRecommendation;