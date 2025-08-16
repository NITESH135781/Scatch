const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const router = express.Router();
const product = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", (req, res) => {
  let error = req.flash("error");
  res.render("index", { error, loggedIn: false });
});

router.get("/shop", isLoggedIn, async function (req, res) {
  let products = await product.find();
  let success = req.flash("success");
  res.render("shop", { products, success });
});

router.get("/cart", isLoggedIn, async function (req, res) {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

    // let bill = 0;

    // user.cart.forEach(item => {
      
    //   bill = (Number(item.price) + 20 - Number(item.discount));
      
    // });
    
  res.render("cart", { user});
});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

  user.cart.push(req.params.productid);
  await user.save();

  req.flash("success", "Product added to cart");
  res.redirect("/shop");
});

router.get("/logout", isLoggedIn, (req, res) => {
  res.render("shop");
});

module.exports = router;
