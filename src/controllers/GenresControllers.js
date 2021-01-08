const Genre = require('../models/Genre');
const Errors = require('../errors');

class GenresControllers {
    async newGenre(name) {
        const genreConflict = await this.getOne(name);
        if(genreConflict) throw new Errors.ExistingGenreError();

        await this.createGenre(name);
    }

    getOne(name) {
        return Genre.findOne({where: { name }});
    }

    createGenre(name) {
        return Genre.create({ name });
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