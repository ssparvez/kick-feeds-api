const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

module.exports.signup = (req, res, next) => {
  // check if email exists already first
  User.find({ email: req.body.email })
    .exec()
    .then(users => {
      if (users.length > 0) {
        return res.status(409).json({
          message: "Email exists"
        })
      } else {
        // encryption will do 10 salt rounds on the password
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            })
          } else {
            // if hash created successfully, save new user
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: 'User created'
                })
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              })
          }
        });
      }
    });
}

module.exports.signin = (req, res, next) => {
  User.find({ email: req.body.email }).exec()
    .then(users => {
      // no user found by email
      if (users.length == 0) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      // if user found, check if password is correct
      // this function looks for the closest hash
      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          })
        }

        if (result) {
          const token = jwt.sign({
              email: users[0].email,
              userId: users[0]._id
            },
            process.env.JWT_PRIVATE_KEY, { expiresIn: '1h' }
          );
          return res.status(200).json({
            message: 'Auth successful',
            token: token
          });
        }
        res.status(401).json({
          message: 'Auth failed'
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
};

module.exports.delete = (req, res, next) => {
  User.remove({ _id: req.params.userId }).exec()
    .then(result => {
      res.status(200).json({
        message: 'User delelted'
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    })
};