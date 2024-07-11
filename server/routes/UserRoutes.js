const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken');
const verifyAdmin = require('../utils/verifyAdmin');
const {
  EditProfile,
  changeUserRole,
  getAllUsers,
  deleteUser,
} = require('../controllers/UserController');

router.post('/edit-user', EditProfile);

router.post('/change-role', verifyToken, verifyAdmin, changeUserRole);

router.get('/users', verifyToken, getAllUsers);

router.post('/deleteUsers', verifyToken, verifyAdmin, deleteUser);

module.exports = router;
