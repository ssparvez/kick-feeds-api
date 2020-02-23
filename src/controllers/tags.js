const mongoose = require('mongoose');
const Tag = require('../models/tag');
const Note = require('../models/note');

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
            ...doc._doc,
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
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
};

module.exports.getOne = (req, res, next) => {
  const id = req.params.tagId;
  Tag.findOne({ _id: id, userId: req.userData.userId })
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}

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
          ...doc._doc,
          request: { type: 'GET', url: 'http://localhost:5000/tags' + doc._id }
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
};

module.exports.update = (req, res, next) => {
  const id = req.params.tagId;

  Tag.findOneAndUpdate({ _id: id, userId: req.userData.userId }, req.body, { new: true })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
};

module.exports.delete = (req, res, next) => {
  const id = req.params.tagId;
  Tag.deleteOne({ _id: id, userId: req.userData.userId })
    .exec()
    .then(result => {
      // update all notes with associated tag?
      Note.updateMany({ tagId: id }, { tagId: null })
        .exec()
        .then(() => {
          res.status(200).json(result);
        })
        .catch(error => {
          res.status(500).json({ error });
        })
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};