const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Recommendation extends Sequelize.Model { }

const attributes = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    score: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    youtubeLink: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
}

const options = {
    sequelize,
    timestamps: false,
    modelName: 'recommendation'
}

Recommendation.init(attributes, options);

module.exports = Recommendation;