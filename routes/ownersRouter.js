const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Owners it's working");   
});

module.exports = router;