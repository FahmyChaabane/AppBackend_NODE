module.exports = (req, res, next) => {
  // shortcut
  if (!req.user.isAdmin) res.status(403).send("Access denied.");

  next();
};
