const mongoose = require('mongoose');
const Note = require("../models/note");

module.exports.getAll = (req, res, next) => {
  console.log('what is req user data', req.userData);
  Note.find({ userId: req.userData.userId })
    // .select('content createdOn _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        notes: docs.map(doc => {
          console.log('whats in the doc');
          console.log(doc);
          return {
            content: doc.content,
            createdOn: doc.createdOn,
            updatedOn: doc.updatedOn,
            tagId: doc.tagId,
            userId: doc.userId,
            _id: doc._id,
            request: { type: 'GET', url: 'http://localhost:5000/notes' + doc._id }
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

module.exports.getSpecific = (req, res, next) => {
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
    createdOn: new Date(),
    updatedOn: new Date()

  });
  note.save()
    .then(doc => {
      console.log(doc);
      res.status(201).json({ // prepare response
        message: "Handling POST requests to /notes",
        createdNote: {
          content: doc.content,
          createdOn: doc.createdOn,
          updatedOn: doc.updatedOn,
          tagId: doc.tagId,
          userId: doc.userId,
          _id: doc._id,
          request: { type: 'GET', url: 'http://localhost:5000/notes' + doc._id }
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

module.exports.update = (req, res, next) => {
  const id = req.params.noteId;
  // const updateOps = {};
  // for (const ops in req.body) {
  //   updateOps[ops.propName] = ops.value;
  // }
  Note.findOneAndUpdate({ _id: id, userId: req.userData.userId }, req.body, { new: true })
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
};

module.exports.delete = (req, res, next) => {
  const id = req.params.noteId;
  Note.remove({ _id: id, userId: req.userData.userId })
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
};