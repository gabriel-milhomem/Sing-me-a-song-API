const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {

    } catch(err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    try {

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