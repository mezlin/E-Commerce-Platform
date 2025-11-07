const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'order-service',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;