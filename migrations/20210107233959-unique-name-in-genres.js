'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('genres', ['name'], {
      type: 'unique',
      name: 'unique_name'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('genres', 'unique_name');
  }
};
