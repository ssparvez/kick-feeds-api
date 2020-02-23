const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require('@sendgrid/mail');
const crypto = require("crypto");


const User = require("../models/user");
const VerificationToken = require("../models/verificationToken");

module.exports.signUp = (req, res, next) => {
  // check if email exists already first
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user) {
        return res.status(409).json({
          message: "An account already exists with this email"
        })
      } else {
        // encryption will do 10 salt rounds on the password
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err });
          }

          // if hash created successfully, save new user
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
          });
          user.save()
            .then(result => {
              // Create a verification token for this user
              const verificationToken = new VerificationToken({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

              // Save the verification token
              verificationToken.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }

                // Send the email
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const origin = (!req.headers.origin.includes('localhost') ? 'https://' : '') + req.headers.origin;
                const confirmationLink = `${origin}/confirmation/${verificationToken.token}`;
                const msg = {
                  to: req.body.email,
                  from: 'no-reply@jotnow.com',
                  templateId: 'd-7de56d53dca542ee9d6f0097ea6dfbba',
                  dynamic_template_data: {
                    confirmationLink: confirmationLink
                  }
                };

                sgMail.send(msg)
                // .then(() => {
                //   res.status(200).send('A verification email has been sent to ' + user.email + '.');
                // })
                // .catch(err => res.status(500).send({ msg: err.message }));
              });

              res.status(201).json({ message: 'User created' })
            })
            .catch(err => {
              res.status(500).json({ error: err });
            })
        });
      }
    });
}

module.exports.signIn = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {

      // no user found by email
      if (user === null) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      // if user found, check if password is correct
      // this function looks for the closest hash
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({ message: 'Auth failed' });
        }

        if (result) {
          // Make sure the user has been verified
          if (!user.isVerified) {
            return res.status(401).send({ type: 'not-verified', msg: 'Your account has not been verified.' });
          }

          const token = jwt.sign({
              email: user.email,
              userId: user._id
            },
            process.env.JWT_PRIVATE_KEY, { expiresIn: '2h' }
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

module.exports.confirm = (req, res, next) => {
  // Find a matching token
  VerificationToken.findOne({ token: req.body.token }, (err, token) => {
    if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

    // If we found a token, find a matching user
    User.findOne({ _id: token._userId }, (err, user) => {
      if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
      if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

      // Verify and save the user
      user.isVerified = true;
      user.save((err) => {
        if (err) { return res.status(500).send({ msg: err.message }); }
        res.status(200).send("The account has been verified. Please log in.");
      });
    });
  });
};

// module.exports.resendToken = (req, res, next) => {};