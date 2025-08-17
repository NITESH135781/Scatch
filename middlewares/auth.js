function isUser(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/login');
}
function isOwner(req, res, next) {
    if (req.session.ownerId) {
        return next();
    }
    res.redirect('/owners');
}


module.exports = { isUser, isOwner };
