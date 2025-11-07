const express = require('express');
const router = express.Router();
const {register} = require('../../metrics/prometheus');

router.get('/metrics', async (req, res) => {
    try {
        console.log('Metrics requested');
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch(e) {
        res.status(500).end(e);
    }
});

module.exports = router;