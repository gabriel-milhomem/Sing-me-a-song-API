const InvalidGenreError = require('./InvalidGenreError');
const ExistingGenreError = require('./ExistingGenreError');
const ExistingSongError = require('./ExistingSongError');
const SongNotFound = require('./SongNotFound');
const GenreNotFound = require('./GenreNotFound');
const ZeroSongsError = require('./ZeroSongsError');

module.exports = {
    InvalidGenreError,
    ExistingGenreError,
    ExistingSongError,
    SongNotFound,
    GenreNotFound,
    ZeroSongsError
}