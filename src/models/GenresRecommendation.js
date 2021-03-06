const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class GenresRecommendation extends Sequelize.Model {

}

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
};

const options = {
    sequelize,
    timestamps: false,
    modelName: 'genresRecommendation'
};

GenresRecommendation.init(attributes, options);

module.exports = GenresRecommendation;