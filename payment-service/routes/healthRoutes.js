const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'payment-service',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;