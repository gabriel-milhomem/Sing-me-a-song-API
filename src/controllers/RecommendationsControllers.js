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

    async downVote(id) {
        const song = await this.getSongById(id);
        if(!song) throw new Errors.SongNotFound();

        if(song.score - 1 < -5) {
            await this.cleanRelationships(id);
            await song.destroy();
        } else {
            song.score -= 1;

            await song.save();
        }
    }

    async generateSong() {
        const allMusics = await this.getAllSongs();
        if(allMusics.length === 0) throw new Errors.ZeroSongsError();

        const filteredSongs = this.probabilityChance(allMusics);

        if(filteredSongs.length === 0) {
            return this.getRandomSongByDefault(allMusics);
        }
        
        const songNumber = this.getNumberBetween(filteredSongs.length, 0);
        return filteredSongs[songNumber];
    }

    async generateSongByGenre(id) {
        const allMusics = await this.getAllSongs();
        if(allMusics.length === 0) throw new Errors.ZeroSongsError();

        const genre = await this.getGenreById(id);
        if(!genre) throw new Errors.GenreNotFound();

        const allSongsByGenre = await this.getSongsByGenre(genre.id);
        if(allSongsByGenre.length === 0) {
            return this.getRandomSongByDefault(allMusics);
        }

        const filteredSongs = this.probabilityChance(allSongsByGenre);
        if(filteredSongs.length === 0) {
            return this.getRandomSongByDefault(allMusics);
        }
        
        const songNumber = this.getNumberBetween(filteredSongs.length, 0);
        return filteredSongs[songNumber];
    }

    getSongsByGenre(id) {
        return Recommendation.findAll({
            include: [{
                where: { id },
                model: Genre,
                through: {
                    attributes: []
                }
            }]
        });
    }

    getAllSongs() {
        return Recommendation.findAll({
            include: [{
                model: Genre,
                through: {
                    attributes: []
                }
            }]
        });
    }

    getRandomSongByDefault(allMusics) {
        const songNumber = this.getNumberBetween(allMusics.length, 0);
        return allMusics[songNumber];
    }

    probabilityChance(allMusics) {
        const chance = this.getNumberBetween(10, 0);
        const filtered = (chance < 7) ? 
            this.filterGreaterThen10(allMusics): 
            this.filterLessEqual10(allMusics)
        ;

        return filtered;
    }

    filterGreaterThen10(songs) {
        return songs.filter(song => song.score > 10);
    }

    filterLessEqual10(songs) {
        return songs.filter(song => song.score <= 10);
    }

    async cleanRelationships(recommendationId) {
        const relationships = await GenresRecommendation.findAll({where: { recommendationId }});
        await Promise.all(relationships.map(r => r.destroy()));
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

    getNumberBetween(max, min) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

module.exports = new RecommendationsControllers();