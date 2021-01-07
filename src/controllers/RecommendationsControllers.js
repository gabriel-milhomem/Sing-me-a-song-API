const Recommendation = require('../models/Recommendation');
const ExistingSongError = require('../errors/ExistingSongError');
const Genre = require('../models/Genre');
const InvalidGenreError = require('../errors/InvalidGenreError');

class RecommendationsControllers {
    getSongByLink(youtubeLink) {
        return Recommendation.findOne({where: { youtubeLink }});
    }

    getGenreById(id) {
        return Genre.findByPk(id);
    }
    
    async newSong(songData) {
        const { youtubeLink, genresIds, name } = songData;
        const songConflict = await this.getSongByLink(youtubeLink);

        if (songConflict) throw new ExistingSongError();

        const isInvalidGenres = await Promise.all(
            genresIds.map(genre => this.getGenreById(genre.id))
        );

        if(isInvalidGenres.some(genre => !genre)) throw new InvalidGenreError();

        
    }
}

module.exports = new RecommendationsControllers();