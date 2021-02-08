const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/config");

// load input validation middleware
const validMW = require("../middlewares/valid.mw");

const User = require("../models/user.model");

exports.signup = (req, res) => {
  // validate form
  const { errors, isValid } = validMW.signup(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // check duplicate
  User.findOne({
    $or: [
      {
        email: req.body.email,
      },
      {
        username: req.body.username,
      },
    ],
  }).then((user) => {
    if (user) {
      let errors = {};
      if (user.email === req.body.email) {
        errors.email = "Email already exists";
      }
      if (user.username === req.body.username) {
        errors.username = "Username already exists";
      }
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      // hash password
      bcrypt.hash(newUser.password, 10, function (err, hash) {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => res.json(user))
          .catch((err) => console.log(err));
      });
    }
  });
};

exports.login = (req, res) => {
  // validate form
  const { errors, isValid } = validMW.login(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (!user) {
      return res.status(404).send({ emailerr: "Email Not found." });
    }

    bcrypt.compare(req.body.password, user.password).then((isMatch) => {
      if (isMatch) {
        // create jwt payload
        const payload = {
          id: user._id,
          username: user.username,
        };

        // sign token
        jwt.sign(
          payload,
          config.SECRET,
          {
            expiresIn: 86400, // 24h
          },
          (err, token) => {
            res.status(200).json({
              id: user._id,
              email: user.email,
              username: user.username,
              token: token,
            });
          }
        );
      } else {
        return res.status(401).json({
          pwderr: "Password incorrect",
        });
      }
    });
  });
};
