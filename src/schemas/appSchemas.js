const Joi = require('joi');

class Schemas {
    postGenre(body) {
        const schema = Joi.object({
            name: Joi.string().trim().required()
        });

        return schema.validate(body);
    }

    postRecommendation(body) {
        const schema = Joi.object({
            name: Joi.string().trim().required(),
            genresIds: Joi.array().items(Joi.number()).min(1).required(),
            youtubeLink: Joi
                .string()
                .trim()
                .pattern(/(?<protocol>(http(s)?:\/\/)?)(?<web>www\.)?(?<domain>(?<desktop>youtube\.com\/)|(?<mobile>youtu.be\/))(?<path>.)+/)
                .required()
        });

        return schema.validate(body);
    }
}

module.exports = new Schemas();