const Genre = require('../models/Genre');
const GenresRecommendation = require('../models/GenresRecommendation');
const Recommendation = require('../models/Recommendation');

Genre.belongsToMany(Recommendation, { through: GenresRecommendation });
Recommendation.belongsToMany(Genre, { through: GenresRecommendation });