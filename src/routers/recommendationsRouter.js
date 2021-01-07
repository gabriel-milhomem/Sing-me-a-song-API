const express = require('express');
const Schemas = require('../schemas/appSchemas');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { error } = Schemas.postRecommendation(req.body);
        if(error) return res.sendStatus(422);

        return res.sendStatus(201);

    } catch(err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

router.post('/:id/upvote', async (req, res) => {
    try {
        

    } catch(err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

router.post('/:id/downvote', async (req, res) => {
    try {

    } catch(err) {
        console.error(err);
        return res.sendStatus(500);
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