const Genre = require('../models/Genre');
const GenreRecommendation = require('../models/GenreRecommendation');
const Recommendation = require('../models/Recommendation');

Genre.belongsToMany(Recommendation, { through: GenreRecommendation });
Recommendation.belongsToMany(Genre, { through: GenreRecommendation });