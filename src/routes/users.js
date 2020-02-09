const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const UserController = require("../controllers/users");

router.post("/signup", UserController.signUp);

router.post('/signin', UserController.signIn);

router.post('/confirmation', UserController.confirm);

// app.post('/resend', userController.resendToken);

router.delete('/:userId', checkAuth, UserController.delete);

module.exports = router;