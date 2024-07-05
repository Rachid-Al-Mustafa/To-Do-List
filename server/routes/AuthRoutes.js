const express = require('express');
const router = express.Router();
const {
  Register,
  Login,
  Logout,
} = require('./../controllers/AuthController');

router.post('/login', Login);

router.post('/register', Register);

router.post('/logout', Logout);

module.exports = router;
