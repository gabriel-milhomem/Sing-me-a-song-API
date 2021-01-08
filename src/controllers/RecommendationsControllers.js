const Recommendation = require('../models/Recommendation');
const GenresRecommendation = require('../models/GenresRecommendation');
const Genre = require('../models/Genre');
const Errors = require('../errors');

class RecommendationsControllers {
    async newRecommendation(songData) {
        const { youtubeLink, genresIds } = songData;
        
        const songConflict = await this.getSongByLink(youtubeLink);
        if (songConflict) throw new Errors.ExistingSongError();

        const isInvalidGenres = await Promise.all(
            genresIds.map(id => this.getGenreById(id))
        );
        if(isInvalidGenres.some(genre => !genre)) throw new Errors.InvalidGenreError();

        const song = await this.createSong(songData);
        await Promise.all(
            genresIds.map(id => this.newRelationship(song.id, id))    
        );
    }

    async upVote(id) {
        const song = await this.getSongById(id);
        if(!song) throw new Errors.SongNotFound();

        song.score += 1;

        await song.save();
    }

    getSongByLink(youtubeLink) {
        return Recommendation.findOne({where: { youtubeLink }});
    }

    getGenreById(id) {
        return Genre.findByPk(id);
    }

    getSongById(id) {
        return Recommendation.findByPk(id);
    }

    createSong(songData) {
        return Recommendation.create(songData);
    }

    newRelationship(recommendationId, genreId) {
        return GenresRecommendation.create({recommendationId, genreId});
    }
}

module.exports = new RecommendationsControllers();