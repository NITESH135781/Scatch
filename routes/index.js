const express = require('express');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const router = express.Router();
const product = require('../models/product-model');

router.get('/', (req, res) => {
    let error = req.flash('error');
    res.render('index', { error });
});

router.get('/shop', isLoggedIn, async function(req, res) {
    let products = await product.find();
    res.render('shop', { products });
})



module.exports = router;