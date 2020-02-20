const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const TagsController = require('../controllers/tags');

router.get("/", checkAuth, TagsController.getAll);

router.post("/", checkAuth, TagsController.create);

router.get("/:tagId", checkAuth, TagsController.getOne);

router.patch("/:tagId", checkAuth, TagsController.update);

router.delete("/:tagId", checkAuth, TagsController.delete);

module.exports = router;