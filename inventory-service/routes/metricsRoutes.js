const express = require('express');
const router = express.Router();
const client = require('prom-client');    

router.get('/metrics', async (req, res) => {
    try {
        console.log('Metrics requested');
        res.set('Content-Type', client.register.contentType);
        res.end(await client.register.metrics());
    } catch(e) {
        res.status(500).end(e);
    }
});

module.exports = router;