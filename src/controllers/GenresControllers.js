const Genre = require('../models/Genre');
const ExistingGenreError = require('../errors/ExistingGenreError');

class GenresControllers {
    async newGenre(name) {
        const genreConflict = await this.getOne(name);
        if(genreConflict) throw new ExistingGenreError();

        await Genre.create({ name });
    }

    getOne(name) {
        return Genre.findOne({where: { name }});
    }

    getAll() {
        return Genre.findAll({
            order: [
                ['name', 'ASC']
            ]
        });
    }
}


module.exports = new GenresControllers();