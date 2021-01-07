const express = require('express');
const router = express.Router();
const Schemas = require('../schemas/appSchemas');
const GenresControllers = require('../controllers/GenresControllers');
const ExistingGenreError = require('../errors/ExistingGenreError');

router.post('/', async (req, res) => {
    try {
        const { body } = req;
        const name = !body.name || body.name.toLowerCase();

        const { error } = Schemas.postGenre(body);
        if (error) return res.sendStatus(422);

        await GenresControllers.newGenre(name);

        res.sendStatus(201);

    } catch(error) {
        console.error(error);
        if(error instanceof ExistingGenreError) {
            res.sendStatus(409);
        } else {
            res.sendStatus(500);
        }
        
        
    }
});

router.get('/', async (req, res) => {
    try {
        const allGenres = await GenresControllers.getAll();
        
        res.status(200).send(allGenres);

    } catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {

    } catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = router;