const mongoose = require('mongoose');
const Tag = require("../models/tag");

module.exports.getAll = (req, res, next) => {
  console.log('what is req user data', req.userData);
  Tag.find({ userId: req.userData.userId })
    // .select('content createdOn _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        tags: docs.map(doc => {
          console.log('whats in the doc');
          console.log(doc);
          return {
            name: doc.name,
            description: doc.description,
            color: doc.color,
            userId: doc.userId,
            _id: doc._id,
            request: { type: 'GET', url: 'http://localhost:5000/tags' + doc._id }
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
};

module.exports.create = (req, res, next) => {
  console.log('hwhat os ')
  console.log(req.body);
  const tag = new Tag({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    color: req.body.color,
    userId: req.body.userId,
  });
  tag.save()
    .then(doc => {
      console.log(doc);
      res.status(201).json({ // prepare response
        message: "Handling POST requests to /tags",
        createdTag: {
          name: doc.name,
          description: doc.description,
          color: doc.color,
          userId: doc.userId,
          _id: doc._id,
          request: { type: 'GET', url: 'http://localhost:5000/tags' + doc._id }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};