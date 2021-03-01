const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const User = require("../models/user.model");

exports.verifyToken = (req, res, next) => {
  // console.log(req.headers)
  let token = req.headers["authorization"];

  // check authorization header
  if (!token) {
    return res.status(200).json({ success: false });
  } else {
    tokenArr = token.split(" ");

    // check bearer token
    if (tokenArr[0] !== "Bearer") {
      return res.status(200).json({ success: false });
    } else {
      // verify jwt
      jwt.verify(tokenArr[1], config.SECRET, (err, decoded) => {
        if (err) {
          return res.status(200).json({ success: false });
        } else {
          req.userId = decoded.id;
          return res.status(200).json({ success: true, msg: decoded.id });
        }
      });
    }
  }
};
