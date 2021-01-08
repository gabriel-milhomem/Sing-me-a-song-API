const express = require('express');
const Schemas = require('../schemas/appSchemas');
const RecommendationsControllers = require('../controllers/RecommendationsControllers');
const Errors = require('../errors/');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { error } = Schemas.postRecommendation(req.body);
        if(error) return res.sendStatus(422);

        await RecommendationsControllers.newRecommendation(req.body);

        res.sendStatus(201);

    } catch(error) {
        console.error(error);
        if(error instanceof Errors.ExistingSongError) {
            res.sendStatus(409);
        } else if (error instanceof Errors.InvalidGenreError) {
            res.sendStatus(403);
        } else {
            res.sendStatus(500);
        }
    }
});

router.post('/:id/upvote', async (req, res) => {
    try {
        await RecommendationsControllers.upVote(Number(req.params.id));

        res.sendStatus(200);

    } catch(error) {
        console.error(error);
        if(error instanceof Errors.SongNotFound) {
            res.sendStatus(404);
        } else {
            res.sendStatus(500);
        }
    }
});

router.post('/:id/downvote', async (req, res) => {
    try {
        await RecommendationsControllers.downVote(Number(req.params.id));

        res.sendStatus(200);

    } catch(error) {
        console.error(error);
        if(error instanceof Errors.SongNotFound) {
            res.sendStatus(404);
        } else {
            res.sendStatus(500);
        }
    }
});

router.get('/random', async (req, res) => {
    try {

    } catch(err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

router.get('/genres/:id/random', async (req, res) => {
    try {

    } catch(err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

router.get('/genres/top/:amount', async (req, res) => {
    try {

    } catch(err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

module.exports = router;