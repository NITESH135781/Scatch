const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model"); // Assuming you have a user model defined

module.exports.isLoggedIn = async (req, res, next) => {
  if (!req.cookies.token) {
    req.flash("error", "You must be logged in to access this page");
    return res.redirect("/");
  }

  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    let user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");
    req.user = user;
    next();
  } catch (e) {
    req.flash("e", "Something went wrong.");
    return res.redirect("/");
  }
};
