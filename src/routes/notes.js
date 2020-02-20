const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const NotesController = require('../controllers/notes');

router.get("/", checkAuth, NotesController.getAll);

router.post("/", checkAuth, NotesController.create);

router.get("/:noteId", checkAuth, NotesController.getOne);

router.patch("/:noteId", checkAuth, NotesController.update);

router.delete("/:noteId", checkAuth, NotesController.delete);

module.exports = router;