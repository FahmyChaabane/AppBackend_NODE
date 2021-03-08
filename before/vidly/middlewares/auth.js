const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token"); // us to define in the header of client request
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decodedPayload = jwt.verify(token, config.get("jwtSecretKey"));
    req.user = decodedPayload; // zed'haa Mosh, puisque aa7na fil gen mtaaa jwt, hattina ken id (w ena zedt name) "so that in our route handle we can access req.user._id and so on"
    next();
  } catch (ex) {
    res.status(400).send("Invalid token. ");
  }
};
