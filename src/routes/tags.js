const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const TagsController = require('../controllers/tags');

router.get("/", checkAuth, TagsController.getAll);

router.post("/", checkAuth, TagsController.create);

// router.get("/:tagId", checkAuth, NotesController.getSpecific);

// router.patch("/:tagId", checkAuth, NotesController.update);

// router.delete("/:tagId", checkAuth, NotesController.delete);

module.exports = router;