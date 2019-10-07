const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Country = require("../models/country");

router.get("/", (req, res, next) => {
  Country.find({ isActive: true })
    .select('name code _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        countries: docs.map(doc => {
          return {
            name: doc.name,
            code: doc.code,
            _id: doc._id,
            request: { type: 'GET', url: 'http://localhost:5000/countries' + doc._id }
          }
        })
      }
      console.log(docs);
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  const country = new Country({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    code: req.body.code
  });
  country
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({ // prepare response
        message: "Handling POST requests to /countries",
        createdCountry: {
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request: { type: 'GET', url: 'http://localhost:5000/countries' + doc._id }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:countryId", (req, res, next) => {
  const id = req.params.countryId;
  Country.findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:countryId", (req, res, next) => {
  const id = req.params.countryId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Country.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:countryId", (req, res, next) => {
  const id = req.params.countryId;
  Country.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;