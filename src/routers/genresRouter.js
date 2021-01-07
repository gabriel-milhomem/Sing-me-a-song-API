const express = require('express');
const router = express.Router();
const Schemas = require('../schemas/appSchemas');
const Genre = require('../models/Genre');

router.post('/', async (req, res) => {
    try {
        const name = req.body.name.toLowerCase();

        const { error } = Schemas.postGenres().validate(req.body);
        if(error) return res.sendStatus(422);

        const genreConflict = await Genre.findOne({where: { name }});
        if(genreConflict) return res.sendStatus(409);

        await Genre.create({ name });

        return res.sendStatus(201);

    } catch(err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

router.get('/', async (req, res) => {
    try {
        const allGenres = await Genre.findAll({
            order: [
                ['name', 'ASC']
            ]
        });

        return res.status(200).send(allGenres);
        
    } catch(err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {

    } catch(err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

module.exports = router;