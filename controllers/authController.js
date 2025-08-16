const userModel = require("../models/user-model"); // Assuming you have a user model defined
const bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const e = require("connect-flash");

module.exports.registerUser = async (req, res) => {
  try {
    let { fullname, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) {
      req.flash("error", "User already exists with this email");
      return res.redirect("/");
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            fullname,
            email,
            password: hash,
          });

          let token = generateToken(user);
          res.cookie("token", token);

          res.redirect("/shop");
        }
      });
    });
  } catch (error) {
    res.send(error.message);
  }
};

module.exports.loginUser = async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (!user) {
    req.flash("error", "Email or password is incorrect");
    return res.redirect("/");
  } else {
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        let token = generateToken(user);
        res.cookie("token", token);
        res.redirect("/shop");
      } else {
        req.flash("error", "Email or password is incorrect");
        return res.redirect("/");
      }
    });
  }
};

module.exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};
