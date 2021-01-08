const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class Genre extends Sequelize.Model { 
    
}

const attributes = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
};

const options = {
    sequelize,
    timestamps: false,
    modelName: 'genre'
};

Genre.init(attributes, options);

module.exports = Genre;