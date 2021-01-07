const joi = require('joi');

class Schemas {
    postGenres() {
        const schema = joi.object({
            name: joi.string().trim().required()
        });

        return schema;
    }
}

module.exports = new Schemas();