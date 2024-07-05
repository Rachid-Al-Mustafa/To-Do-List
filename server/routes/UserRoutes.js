const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken');
const verifyAdmin = require('../utils/verifyAdmin');
const { EditProfile, changeUserRole } = require('../controllers/UserController');

router.post('/edit-user', EditProfile);

router.put('/change-role', verifyToken, verifyAdmin, changeUserRole);

module.exports = router;
