const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const router = express.Router();
const product = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", (req, res) => {
  let error = req.flash("error");
  res.render("index", { error, loggedIn: false });
});

router.get('/account', isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({email: req.user.email});
  if(user){
    res.render("myAccount", {user});
  }
  
})

router.get("/shop", isLoggedIn, async function (req, res) {
  let products = await product.find();
  let success = req.flash("success");

  let admin = 
  res.render("shop", { products, success });
});

router.get("/cart", isLoggedIn, async function (req, res) {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

  let subtotal = user.cart.reduce((total, product) => {
    let finalPrice = product.price - (product.discount || 0);
    return total + finalPrice;
  }, 0);

  let gst = subtotal * 0.18;

  let total = subtotal + gst;

  let success = req.flash("success");
  res.render("cart", { user, success, subtotal, gst, total });
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

router.get("/removetocart/:productid", isLoggedIn, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/cart");
    }

    // Remove product by filtering cart
    user.cart = user.cart.filter((id) => !id.equals(req.params.productid));

    await user.save();

    req.flash("success", "Product removed from cart");
    res.redirect("/cart");
  } catch (err) {
    console.error("Error removing product from cart:", err);
    req.flash("error", "Something went wrong");
    res.redirect("/cart");
  }
});

router.get("/allclear", isLoggedIn, async function (req, res) {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

  user.cart = []; // Clear the cart

  await user.save();

  req.flash("success", "All products removed from cart");
  res.redirect("/cart");
});

router.get("/logout", isLoggedIn, (req, res) => {
  res.render("shop");
});

module.exports = router;
