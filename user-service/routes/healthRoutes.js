const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    console.log('Health check requested');
    res.status(200).json({
        status: 'UP',
        uptime: process.uptime(),
        service: 'user-service',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;