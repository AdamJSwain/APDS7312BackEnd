const jwt = require("jsonwebtoken");

function authenticate(req, res, next){
  let token = req.header("x-access-token");

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Authentication failed." });
      } else {
        req.userID = decoded.userID;
        next();
      }
    }
  );
};

module.exports = authenticate;