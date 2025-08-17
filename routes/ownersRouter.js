const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mongoose = require("../models/owner-model");
const ownerModel = require("../models/owner-model");
const product = require("../models/product-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { isOwner, isUser } = require('../middlewares/auth');

router.get('/', (req, res) => {
    let error = req.flash("error");
    res.render('owner-login', { error });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const owner = await ownerModel.findOne({ email });
  if (!owner) return res.render('owner-login', { error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, owner.password);
  if (!match) return res.render('owner-login', { error: 'Invalid credentials' });

  req.session.ownerId = owner._id;

  let products = await product.find();

  res.render('Owner-dashboard', { success: 'Login successful', products });
});

router.get('/create', async (req, res) => {
    res.render('createproducts', { success: req.flash('success'), error: req.flash('error') });
});



module.exports = router;
