const mongoose = require('mongoose');
const Note = require("../models/note");

module.exports.getAll = (req, res, next) => {
  const queries = {}; // all possible 
  if (req.query.tagId) queries['tagId'] = req.query.tagId;
  Note.find({ userId: req.userData.userId, ...queries })
    // .select('content createdOn _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        notes: docs.map(doc => {
          return {
            ...doc._doc,
            request: { type: 'GET', url: 'http://localhost:5000/notes' + doc._id }
          }
        })
      }
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
  const id = req.params.noteId;
  Note.findOne({ _id: id, userId: req.userData.userId })
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
  const note = new Note({
    _id: new mongoose.Types.ObjectId(),
    userId: req.body.userId,
    content: req.body.content,
    tagId: req.body.tagId,
    createdOn: new Date(),
    updatedOn: new Date()
  });

  note.save()
    .then(doc => {
      console.log(doc);
      res.status(201).json({ // prepare response
        message: "Handling POST requests to /notes",
        createdNote: {
          ...doc._doc,
          request: { type: 'GET', url: 'http://localhost:5000/notes' + doc._id }
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
};

module.exports.update = (req, res, next) => {
  const id = req.params.noteId;

  Note.findOneAndUpdate({ _id: id, userId: req.userData.userId }, req.body, { new: true })
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
  const id = req.params.noteId;
  Note.remove({ _id: id, userId: req.userData.userId })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
};